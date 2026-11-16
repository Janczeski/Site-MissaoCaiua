// Configuração pública de rastreamento injetada no HTML (window.__SITE_CONFIG__).
//
// O Pixel da Meta só é liberado com:
//   META_PIXEL_ENABLED=true  (texto exato; qualquer outro valor = desativado)
//   META_PIXEL_ID=<somente dígitos>
//   CANONICAL_HOST=<domínio de produção>  (o mesmo usado nos redirecionamentos)
// e somente para requisições cujo Host é o domínio canônico, fora do /admin.
// localhost, a URL temporária *.sslip.io e qualquer outro domínio ficam sem pixel.

const PIXEL_ID = /^\d{10,20}$/;

export function readMetaPixelEnv(env = process.env) {
  const enabled = String(env.META_PIXEL_ENABLED ?? '').trim() === 'true';
  const id = String(env.META_PIXEL_ID ?? '').trim();
  const canonicalHost = String(env.CANONICAL_HOST ?? '').trim().toLowerCase();
  if (!enabled || !PIXEL_ID.test(id) || !canonicalHost) return null;
  return { id, canonicalHost };
}

// Usa o cabeçalho Host, como o redirecionamento de domínios já faz. Não usa req.hostname:
// com `trust proxy` ligado, ele aceita X-Forwarded-Host, que o cliente pode forjar.
// O Traefik (Coolify) e o Cloudflare repassam o Host original.
export function requestHost(req) {
  return String(req.headers.host || '').toLowerCase().split(':')[0];
}

// O React Router decodifica o caminho antes de comparar rotas (/%61dmin abre o admin)
export const isAdminPath = (pathname) => {
  let path = String(pathname || '');
  try {
    path = decodeURIComponent(path);
  } catch {
    /* caminho malformado: compara como veio */
  }
  path = path.toLowerCase().replace(/\/+$/, '');
  return path === '/admin' || path.startsWith('/admin/');
};

export function publicSiteConfig(pixelEnv, { host, path }) {
  const eligible = Boolean(pixelEnv) && host === pixelEnv.canonicalHost && !isAdminPath(path);
  return { metaPixel: eligible ? { id: pixelEnv.id, host: pixelEnv.canonicalHost } : null };
}

// JSON seguro dentro de <script>: impede fechar a tag ou abrir comentário HTML
export function serializeForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
