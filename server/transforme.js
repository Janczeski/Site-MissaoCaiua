// Integração com a Transforme.tech (plataforma de doações).
// A partir do código do widget, lê os dados públicos da campanha (título, textos, banners,
// valores) e converte para o formato do site: textos no formato do RichText e banners em WebP.
import crypto from 'node:crypto';
import sharp from 'sharp';

// Só busca nesses domínios (o código vem do admin e as imagens vêm da Transforme)
const ALLOWED_HOSTS = /(^|\.)(transforme\.solutions|transforme\.tech|ideveloper\.com\.br)$/i;
const MAX_IMAGE_BYTES = 30 * 1024 * 1024;

const allowedUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ALLOWED_HOSTS.test(url.hostname) ? url : null;
  } catch {
    return null;
  }
};

// Aceita o código do widget (qualquer modo) ou o link do hotsite (https://....transforme.solutions/2363)
export function parseWidgetCode(code) {
  const text = String(code || '');
  const uuid = /data-transforme-uuid\s*=\s*["']\s*(\d+)\s*["']/i.exec(text)?.[1];
  const src = /<script[^>]+src\s*=\s*["']([^"']*widget-embed\.js[^"']*)["']/i.exec(text)?.[1];
  if (uuid && src) {
    const url = allowedUrl(src);
    return url ? { uuid, origin: url.origin } : null;
  }
  const link = /https:\/\/[^\s"'<>]+/i.exec(text)?.[0];
  const url = link && allowedUrl(link);
  const fromPath = url && /^\/(\d+)(?:[/-]|$)/.exec(url.pathname)?.[1];
  return fromPath ? { uuid: fromPath, origin: url.origin } : null;
}

// ---------- Textos (HTML da Transforme → formato do RichText) ----------

const ACCENTS = { acute: '́', grave: '̀', circ: '̂', tilde: '̃', uml: '̈', cedil: '̧', ring: '̊' };
const NAMED = {
  nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", mdash: '—', ndash: '–', hellip: '…',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', laquo: '«', raquo: '»', ordm: 'º', ordf: 'ª',
  deg: '°', middot: '·', bull: '•', euro: '€', copy: '©', reg: '®', trade: '™',
};

function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, name) => {
    if (name[0] === '#') {
      const code = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
      return code > 0 && code < 0x110000 ? String.fromCodePoint(code) : '';
    }
    if (name in NAMED) return NAMED[name];
    const accent = /^([a-z])(acute|grave|circ|tilde|uml|cedil|ring)$/i.exec(name);
    return accent ? (accent[1] + ACCENTS[accent[2]]).normalize('NFC') : match;
  });
}

// Parágrafos, subtítulos (##), listas (-), negrito (**) e links ([texto](url)); o resto vira texto puro
export function htmlToText(html) {
  const text = String(html || '')
    .replace(/\r?\n/g, ' ')
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<a\s[^>]*href\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
      const clean = label.replace(/<[^>]+>/g, '').replace(/[[\]]/g, '').trim();
      return clean && clean !== href ? `[${clean}](${href})` : href;
    })
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<h[1-6][^>]*>/gi, '\n\n## ')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/(p|div|h[1-6]|ul|ol|blockquote|table|tr)>/gi, '\n\n')
    .replace(/<\/?(strong|b)(\s[^>]*)?>/gi, '**')
    .replace(/<[^>]+>/g, '');

  return decodeEntities(text)
    .split('\n')
    .map((line) => {
      let l = line.replace(/[\s ]+/g, ' ').replace(/\*\*\s*\*\*/g, '').trim();
      // Negrito que atravessa linhas: tira as marcações soltas
      if ((l.match(/\*\*/g) || []).length % 2) l = l.replace(/\*\*/g, '');
      return /^(##|-)$/.test(l) ? '' : l;
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const singleLine = (html) => htmlToText(html).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();

// ---------- Banners (GIF/PNG da Transforme → WebP leve) ----------

async function download(value) {
  const url = allowedUrl(value);
  if (!url) throw new Error(`Endereço de imagem não permitido: ${value}`);
  const res = await fetch(url, { signal: AbortSignal.timeout(60_000), redirect: 'error' });
  if (!res.ok) throw new Error(`Imagem indisponível (${res.status}): ${value}`);
  if (Number(res.headers.get('content-length') || 0) > MAX_IMAGE_BYTES) throw new Error('Imagem muito grande');
  const data = Buffer.from(await res.arrayBuffer());
  if (data.length > MAX_IMAGE_BYTES) throw new Error('Imagem muito grande');
  return data;
}

// Banners animados costumam ser uma sequência de slides: cada quadro que fica parado por
// pelo menos 1s vira um slide, e quadros repetidos (ex.: a volta ao primeiro) são descartados
async function slidePages(data) {
  const { pages = 1, delay = [] } = await sharp(data, { animated: true }).metadata();
  if (pages < 2) return [0];
  const held = delay.map((ms, page) => (ms >= 1000 ? page : -1)).filter((page) => page >= 0);
  const kept = [];
  for (const page of held.length ? held : [0]) {
    const thumb = await sharp(data, { page }).resize(32, 16, { fit: 'fill' }).greyscale().raw().toBuffer();
    const differs = (other) => thumb.reduce((sum, v, i) => sum + Math.abs(v - other[i]), 0) / thumb.length > 12;
    if (kept.every((k) => differs(k.thumb))) kept.push({ page, thumb });
    if (kept.length >= 8) break;
  }
  return kept.map((k) => k.page);
}

// Converte e guarda no banco (tabela files); o resultado fica em cache pela URL de origem,
// que muda sempre que a imagem é trocada na Transforme
async function importImage(pool, source, width) {
  const key = `${width}:${source}`;
  const cached = await pool.query('SELECT urls FROM remote_images WHERE source = $1', [key]);
  if (cached.rows[0]) return cached.rows[0].urls;

  const data = await download(source);
  const urls = [];
  for (const page of await slidePages(data)) {
    const webp = await sharp(data, { page }).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    const id = crypto.createHash('sha256').update(`${key}#${page}`).digest('hex').slice(0, 24);
    await pool.query(
      'INSERT INTO files (id, name, mime, size, data) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
      [id, `banner-${page}.webp`, 'image/webp', webp.length, webp],
    );
    urls.push(`/files/${id}/banner-${page}.webp`);
  }
  await pool.query(
    'INSERT INTO remote_images (source, urls) VALUES ($1, $2) ON CONFLICT (source) DO UPDATE SET urls = EXCLUDED.urls',
    [key, JSON.stringify(urls)],
  );
  return urls;
}

// Imagem com problema não impede a campanha de aparecer (só fica sem banner)
const tryImport = (pool, source, width) =>
  source
    ? importImage(pool, source, width).catch((err) => {
      console.error('Transforme: erro ao importar imagem', source, err.message);
      return [];
    })
    : Promise.resolve([]);

// ---------- Campanha ----------

const money = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

export async function fetchCampaign(pool, { uuid, origin }) {
  const res = await fetch(`${origin}/${encodeURIComponent(uuid)}/widget-config`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(15_000),
  });
  if (res.status === 404) throw new Error('Campanha não encontrada na Transforme.tech');
  if (!res.ok) throw new Error(`Transforme.tech respondeu com erro ${res.status}`);
  const body = await res.json().catch(() => null);
  const d = body?.data ?? body;
  if (!d || typeof d !== 'object' || !('titulo' in d || 'nome' in d)) {
    throw new Error('Resposta inesperada da Transforme.tech');
  }

  const [desktop, mobile, background] = await Promise.all([
    tryImport(pool, d.imagemCadastroUrl || d.widgetImagemUrl, 1600),
    tryImport(pool, d.imagemCadastroMobileUrl, 800),
    tryImport(pool, d.templateBannerFundo, 1920),
  ]);

  return {
    title: singleLine(d.titulo || d.widgetTextoTitulo || d.nome) || `Campanha ${uuid}`,
    tagline: singleLine(d.widgetDescricao),
    summary: htmlToText(d.descricaoCurta),
    description: htmlToText(d.descricao),
    url: allowedUrl(d.urlRegistro)?.href || `${origin}/${uuid}`,
    open: d.flagativo !== false,
    values: (Array.isArray(d.valoresSugeridos) ? d.valoresSugeridos : [])
      .map(Number).filter((v) => v > 0).sort((a, b) => a - b),
    customValue: Boolean(d.flagvalorpersonalizado),
    monthly: Boolean(d.flagopcaomensal),
    oneTime: Boolean(d.flagopcaoavulso),
    raised: money(d.valorArrecadado),
    donors: money(d.totalDoadores),
    goal: d.paramsMetaAtivo ? money(d.paramsMetaValor) : 0,
    showRaised: Boolean(d.paramsMetaExibirValor),
    // Versão do celular só quando tem um slide para cada slide do computador
    slides: desktop.map((src, i) => ({ desktop: src, mobile: mobile.length === desktop.length ? mobile[i] : null })),
    background: background[0] || null,
  };
}
