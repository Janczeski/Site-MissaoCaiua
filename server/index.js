// API e servidor do site da Missão Caiuá.
// - /api/*   : conteúdo editável, notícias, projetos, documentos e login do admin
// - /files/* : imagens e PDFs enviados pelo admin (guardados no Postgres)
// - resto    : site compilado (dist/) com fallback para o index.html (SPA)
import express from 'express';
import multer from 'multer';
import pg from 'pg';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchCampaign, parseWidgetCode } from './transforme.js';

const { DATABASE_URL, ADMIN_PASSWORD } = process.env;
const PORT = Number(process.env.PORT || 3001);
const TOKEN_SECRET = process.env.TOKEN_SECRET || ADMIN_PASSWORD;
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;
// 90MB: abaixo do limite de 100MB por envio do Cloudflare (plano gratuito)
const MAX_UPLOAD_BYTES = 90 * 1024 * 1024;
const FILE_CHUNK_BYTES = 4 * 1024 * 1024;

if (!DATABASE_URL) throw new Error('DATABASE_URL não configurada');
if (!ADMIN_PASSWORD) throw new Error('ADMIN_PASSWORD não configurada');

const pool = new pg.Pool({ connectionString: DATABASE_URL });

// ==================== BANCO ====================

async function migrate() {
  // Lock evita corrida quando duas instâncias sobem juntas (ex.: deploy sem downtime)
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(19280828)');
    await client.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      mime TEXT NOT NULL,
      size INTEGER NOT NULL,
      data BYTEA NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS news (
      id BIGSERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL DEFAULT '',
      date DATE NOT NULL DEFAULT CURRENT_DATE,
      category TEXT NOT NULL DEFAULT 'geral',
      image TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT '',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS projects (
      id BIGSERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      coordinates JSONB NOT NULL DEFAULT '[-22.2211, -54.8056]',
      image TEXT NOT NULL DEFAULT '',
      raised NUMERIC NOT NULL DEFAULT 0,
      goal NUMERIC NOT NULL DEFAULT 0,
      donation_link TEXT NOT NULL DEFAULT '',
      show_goal BOOLEAN NOT NULL DEFAULT TRUE,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS documents (
      id BIGSERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      date DATE NOT NULL DEFAULT CURRENT_DATE,
      file_url TEXT NOT NULL,
      file_name TEXT NOT NULL DEFAULT '',
      file_size INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Endereços do site antigo (WordPress) que redirecionam para o novo
    CREATE TABLE IF NOT EXISTS redirects (
      path TEXT PRIMARY KEY,
      target TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Campanhas da Transforme.tech: o admin cola o código do widget e os dados vêm de lá
    -- (data guarda a última leitura, usada enquanto a próxima não chega)
    CREATE TABLE IF NOT EXISTS campaigns (
      id BIGSERIAL PRIMARY KEY,
      uuid TEXT NOT NULL UNIQUE,
      origin TEXT NOT NULL,
      code TEXT NOT NULL DEFAULT '',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      data JSONB,
      fetched_at TIMESTAMPTZ,
      fetch_error TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Banners da Transforme já convertidos (origem → URLs em /files)
    CREATE TABLE IF NOT EXISTS remote_images (
      source TEXT PRIMARY KEY,
      urls JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Sem compressão: permite ler trechos de arquivos grandes (vídeos) sem carregar tudo
    ALTER TABLE files ALTER COLUMN data SET STORAGE EXTERNAL;
  `);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Colunas que o admin pode gravar em cada tabela, com o conversor de cada uma
// Remove o caractere NUL, que o Postgres não aceita em texto
const str = (v) => (v == null ? '' : String(v).replace(/\u0000/g, ''));
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const bool = (v) => v !== false && v !== 'false';
const date = (v) => (v ? String(v).slice(0, 10) : new Date().toISOString().slice(0, 10));
const json = (v) => JSON.stringify(v ?? null);

const TABLES = {
  news: {
    order: 'date DESC, id DESC',
    columns: { title: str, subtitle: str, date, category: str, image: str, content: str, author: str, active: bool },
  },
  projects: {
    order: 'created_at DESC, id DESC',
    columns: {
      title: str, description: str, category: str, location: str, coordinates: json, image: str,
      raised: num, goal: num, donation_link: str, show_goal: bool, active: bool,
    },
  },
  documents: {
    order: 'date DESC, id DESC',
    columns: {
      title: str, description: str, category: str, date, file_url: str, file_name: str,
      file_size: num, active: bool,
    },
  },
};

// NUMERIC volta como string do pg; converte para número na resposta
function normalize(row) {
  if (!row) return row;
  const out = { ...row, id: Number(row.id) };
  for (const k of ['raised', 'goal']) if (k in out) out[k] = Number(out[k]);
  if (out.date instanceof Date) out.date = out.date.toISOString().slice(0, 10);
  return out;
}

function pickColumns(table, body, partial) {
  const { columns } = TABLES[table];
  const keys = Object.keys(columns).filter((k) => !partial || k in body);
  return { keys, values: keys.map((k) => columns[k](body[k])) };
}

// ==================== AUTENTICAÇÃO ====================

function sign(payload) {
  return crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
}

function createToken() {
  const payload = String(Date.now() + TOKEN_TTL_MS);
  return `${payload}.${sign(payload)}`;
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

function isValidToken(token) {
  const [payload, signature] = String(token || '').split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  return Number(payload) > Date.now();
}

function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!isValidToken(token)) return res.status(401).json({ error: 'Não autorizado' });
  next();
}

const isAdminRequest = (req) => isValidToken((req.headers.authorization || '').replace(/^Bearer /, ''));

// Limita tentativas de login por IP (10 a cada 15 min)
const loginAttempts = new Map();
function loginRateLimit(req, res, next) {
  const now = Date.now();
  const entry = loginAttempts.get(req.ip) || { count: 0, reset: now + 15 * 60 * 1000 };
  if (now > entry.reset) Object.assign(entry, { count: 0, reset: now + 15 * 60 * 1000 });
  entry.count += 1;
  loginAttempts.set(req.ip, entry);
  if (entry.count > 10) return res.status(429).json({ error: 'Muitas tentativas. Aguarde alguns minutos.' });
  next();
}

// ==================== APP ====================

const app = express();
app.set('trust proxy', true);
app.use(express.json({ limit: '2mb' }));

const asyncRoute = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Domínios alternativos (ex.: www, domínio antigo) redirecionam para o principal mantendo o caminho.
// CANONICAL_HOST=missaocaiua.org.br  REDIRECT_HOSTS=www.missaocaiua.org.br,caiua.org.br,www.caiua.org.br
const CANONICAL_HOST = (process.env.CANONICAL_HOST || '').toLowerCase();
const REDIRECT_HOSTS = new Set(
  (process.env.REDIRECT_HOSTS || '').split(',').map((h) => h.trim().toLowerCase()).filter(Boolean),
);
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase().split(':')[0];
  if (CANONICAL_HOST && REDIRECT_HOSTS.has(host)) {
    return res.redirect(301, `https://${CANONICAL_HOST}${req.originalUrl}`);
  }
  next();
});

app.post('/api/login', loginRateLimit, (req, res) => {
  if (!safeEqual(req.body?.password ?? '', ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }
  loginAttempts.delete(req.ip);
  res.json({ token: createToken() });
});

app.get('/api/health', asyncRoute(async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ ok: true });
}));

app.get('/api/session', (req, res) => res.json({ valid: isAdminRequest(req) }));

// ---------- Conteúdo editável ----------

async function loadContent() {
  const { rows } = await pool.query('SELECT key, value FROM site_content');
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

app.get('/api/content', asyncRoute(async (_req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.json(await loadContent());
}));

app.put('/api/content/:key', requireAdmin, asyncRoute(async (req, res) => {
  const { key } = req.params;
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(key)) return res.status(400).json({ error: 'Chave inválida' });
  if (typeof req.body !== 'object' || req.body === null) return res.status(400).json({ error: 'Conteúdo inválido' });
  await pool.query(
    `INSERT INTO site_content (key, value, updated_at) VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [key, JSON.stringify(req.body)],
  );
  res.json({ ok: true });
}));

// ---------- CRUD de notícias, projetos e documentos ----------

for (const table of Object.keys(TABLES)) {
  const base = `/api/${table}`;
  const { order } = TABLES[table];

  // Público vê só os ativos; o admin vê tudo
  app.get(base, asyncRoute(async (req, res) => {
    const all = isAdminRequest(req);
    const { rows } = await pool.query(
      `SELECT * FROM ${table} ${all ? '' : 'WHERE active'} ORDER BY ${order}`,
    );
    res.set('Cache-Control', 'no-cache');
    res.json(rows.map(normalize));
  }));

  app.get(`${base}/:id`, asyncRoute(async (req, res) => {
    const all = isAdminRequest(req);
    const { rows } = await pool.query(
      `SELECT * FROM ${table} WHERE id = $1 ${all ? '' : 'AND active'}`,
      [Number(req.params.id) || 0],
    );
    if (!rows[0]) return res.status(404).json({ error: 'Não encontrado' });
    res.json(normalize(rows[0]));
  }));

  app.post(base, requireAdmin, asyncRoute(async (req, res) => {
    const { keys, values } = pickColumns(table, req.body || {}, false);
    const { rows } = await pool.query(
      `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`,
      values,
    );
    res.status(201).json(normalize(rows[0]));
  }));

  app.put(`${base}/:id`, requireAdmin, asyncRoute(async (req, res) => {
    const { keys, values } = pickColumns(table, req.body || {}, true);
    if (!keys.length) return res.status(400).json({ error: 'Nada para atualizar' });
    const id = Number(req.params.id) || 0;
    const previous = table === 'documents'
      ? (await pool.query('SELECT file_url FROM documents WHERE id = $1', [id])).rows[0]
      : null;
    const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const { rows } = await pool.query(
      `UPDATE ${table} SET ${sets}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id],
    );
    if (!rows[0]) return res.status(404).json({ error: 'Não encontrado' });
    // PDF trocado: apaga o arquivo antigo
    if (previous && previous.file_url !== rows[0].file_url) await deleteStoredFile(previous.file_url);
    res.json(normalize(rows[0]));
  }));

  app.delete(`${base}/:id`, requireAdmin, asyncRoute(async (req, res) => {
    const { rows } = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [Number(req.params.id) || 0]);
    // Documento excluído: apaga também o PDF
    if (table === 'documents' && rows[0]) await deleteStoredFile(rows[0].file_url);
    res.json({ ok: true });
  }));
}

// ---------- Campanhas da Transforme.tech ----------

// Os dados são relidos da Transforme quando a última leitura tem mais de 10 minutos.
// A leitura acontece em segundo plano: o site responde na hora com a versão guardada.
const CAMPAIGN_STALE_MS = 10 * 60 * 1000;
const refreshing = new Map();

function refreshCampaign(row) {
  if (refreshing.has(row.id)) return refreshing.get(row.id);
  const job = (async () => {
    try {
      const data = await fetchCampaign(pool, row);
      const { rows } = await pool.query(
        `UPDATE campaigns SET data = $1, fetched_at = NOW(), fetch_error = '' WHERE id = $2 RETURNING *`,
        [JSON.stringify(data), row.id],
      );
      return rows[0];
    } catch (err) {
      // Guarda o erro e mantém os dados anteriores; tenta de novo só depois do intervalo
      await pool.query('UPDATE campaigns SET fetched_at = NOW(), fetch_error = $1 WHERE id = $2', [
        str(err.message).slice(0, 300), row.id,
      ]);
      throw err;
    } finally {
      refreshing.delete(row.id);
    }
  })();
  refreshing.set(row.id, job);
  return job;
}

const isStale = (row) => !row.fetched_at || Date.now() - new Date(row.fetched_at).getTime() > CAMPAIGN_STALE_MS;
const refreshInBackground = (row) => {
  if (isStale(row)) refreshCampaign(row).catch((err) => console.error(`Campanha ${row.uuid}:`, err.message));
};

const campaignView = (row) => ({
  id: Number(row.id),
  uuid: row.uuid,
  origin: row.origin,
  active: row.active,
  fetched_at: row.fetched_at,
  fetch_error: row.fetch_error,
  created_at: row.created_at,
  ...(row.data || {}),
});

// Público: publicadas no site, já lidas e abertas na Transforme
const isPublic = (row) => row.active && row.data && row.data.open !== false;

const parseCode = (code) => {
  const target = parseWidgetCode(code);
  if (!target) {
    const err = new Error('Código não reconhecido. Cole o código do widget da Transforme.tech ou o link do hotsite.');
    throw Object.assign(err, { status: 400, expose: true });
  }
  return target;
};

// No admin, mostra o motivo quando a Transforme não responde ou a campanha não existe
const fetchForAdmin = (target) =>
  fetchCampaign(pool, target).catch((err) => {
    throw Object.assign(err, { status: 502, expose: true });
  });

app.get('/api/campaigns', asyncRoute(async (req, res) => {
  const all = isAdminRequest(req);
  const { rows } = await pool.query('SELECT * FROM campaigns ORDER BY created_at DESC, id DESC');
  rows.forEach(refreshInBackground);
  res.set('Cache-Control', 'no-cache');
  res.json(rows.filter((r) => all || isPublic(r)).map(campaignView));
}));

app.get('/api/campaigns/:uuid', asyncRoute(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM campaigns WHERE uuid = $1', [str(req.params.uuid)]);
  const row = rows[0];
  if (!row || !(isAdminRequest(req) || (row.active && row.data))) return res.status(404).json({ error: 'Não encontrada' });
  refreshInBackground(row);
  res.set('Cache-Control', 'no-cache');
  res.json(campaignView(row));
}));

// Prévia no admin antes de salvar (também já converte os banners, então salvar fica instantâneo)
app.post('/api/campaigns/preview', requireAdmin, asyncRoute(async (req, res) => {
  const target = parseCode(req.body?.code);
  res.json({ ...target, ...(await fetchForAdmin(target)) });
}));

app.post('/api/campaigns', requireAdmin, asyncRoute(async (req, res) => {
  const target = parseCode(req.body?.code);
  const data = await fetchForAdmin(target);
  const { rows } = await pool.query(
    `INSERT INTO campaigns (uuid, origin, code, data, fetched_at) VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (uuid) DO NOTHING RETURNING *`,
    [target.uuid, target.origin, str(req.body.code), JSON.stringify(data)],
  );
  if (!rows[0]) return res.status(409).json({ error: `A campanha ${target.uuid} já está cadastrada.` });
  res.status(201).json(campaignView(rows[0]));
}));

app.put('/api/campaigns/:id', requireAdmin, asyncRoute(async (req, res) => {
  const { rows } = await pool.query(
    'UPDATE campaigns SET active = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [bool(req.body?.active), Number(req.params.id) || 0],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Não encontrada' });
  res.json(campaignView(rows[0]));
}));

app.post('/api/campaigns/:id/refresh', requireAdmin, asyncRoute(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM campaigns WHERE id = $1', [Number(req.params.id) || 0]);
  if (!rows[0]) return res.status(404).json({ error: 'Não encontrada' });
  res.json(campaignView(await refreshCampaign(rows[0]).catch((err) => {
    throw Object.assign(err, { status: 502, expose: true });
  })));
}));

app.delete('/api/campaigns/:id', requireAdmin, asyncRoute(async (req, res) => {
  await pool.query('DELETE FROM campaigns WHERE id = $1', [Number(req.params.id) || 0]);
  res.json({ ok: true });
}));

// ---------- Arquivos (imagens, PDFs e vídeos) ----------

async function deleteStoredFile(url) {
  const id = /^\/files\/([a-f0-9]+)/.exec(url || '')?.[1];
  if (id) await pool.query('DELETE FROM files WHERE id = $1', [id]);
}

const ALLOWED_MIME = /^(image\/(png|jpe?g|gif|webp|svg\+xml|avif)|application\/pdf|video\/(mp4|webm|quicktime))$/;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  defParamCharset: 'utf8', // mantém acentos no nome do arquivo
});

app.post('/api/upload', requireAdmin, upload.single('file'), asyncRoute(async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  if (!ALLOWED_MIME.test(file.mimetype)) return res.status(400).json({ error: 'Tipo de arquivo não permitido' });

  const originalName = file.originalname;
  const id = crypto.randomBytes(12).toString('hex');
  await pool.query(
    'INSERT INTO files (id, name, mime, size, data) VALUES ($1, $2, $3, $4, $5)',
    [id, originalName, file.mimetype, file.size, file.buffer],
  );
  const slug = originalName.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-');
  res.status(201).json({ url: `/files/${id}/${slug}`, name: originalName, size: file.size });
}));

const readChunk = async (id, start, length) =>
  (await pool.query('SELECT substring(data FROM $2 FOR $3) AS chunk FROM files WHERE id = $1', [id, start + 1, length]))
    .rows[0]?.chunk;

// Suporta "Range" (necessário para vídeos) e envia arquivos grandes em partes
app.get('/files/:id/:name?', asyncRoute(async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT name, mime, size FROM files WHERE id = $1', [id]);
  const file = rows[0];
  if (!file) return res.status(404).send('Arquivo não encontrado');

  res.set('Content-Type', file.mime);
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Accept-Ranges', 'bytes');
  if (file.mime === 'image/svg+xml') res.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'");
  res.set('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(file.name)}`);

  let start = 0;
  let end = file.size - 1;
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (range && (range[1] || range[2])) {
    if (range[1]) {
      start = Number(range[1]);
      if (range[2]) end = Math.min(Number(range[2]), file.size - 1);
    } else {
      start = Math.max(0, file.size - Number(range[2]));
    }
    if (start > end || start >= file.size) {
      res.set('Content-Range', `bytes */${file.size}`);
      return res.status(416).end();
    }
    res.status(206).set('Content-Range', `bytes ${start}-${end}/${file.size}`);
  }

  res.set('Content-Length', String(end - start + 1));
  if (req.method === 'HEAD') return res.end();

  for (let pos = start; pos <= end; pos += FILE_CHUNK_BYTES) {
    const chunk = await readChunk(id, pos, Math.min(FILE_CHUNK_BYTES, end - pos + 1));
    if (!chunk || res.destroyed) break;
    if (!res.write(chunk)) await new Promise((resolve) => res.once('drain', resolve));
  }
  res.end();
}));

// ---------- Redirecionamentos do site antigo ----------

let redirectMap = new Map();
const normalizePath = (p) => {
  let v = p;
  try {
    v = decodeURIComponent(p);
  } catch {
    // mantém como veio
  }
  v = v.toLowerCase();
  return v.length > 1 ? v.replace(/\/+$/, '') : v;
};

async function loadRedirects() {
  const { rows } = await pool.query('SELECT path, target FROM redirects');
  redirectMap = new Map(rows.map((r) => [normalizePath(r.path), r.target]));
}

app.get('/api/redirects', requireAdmin, asyncRoute(async (_req, res) => {
  const { rows } = await pool.query('SELECT path, target FROM redirects ORDER BY path');
  res.json(rows);
}));

// Recebe [{ path, target }] e grava (substitui se já existir)
app.post('/api/redirects', requireAdmin, asyncRoute(async (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [];
  for (const { path: p, target } of items) {
    if (typeof p !== 'string' || typeof target !== 'string' || !p.startsWith('/')) continue;
    await pool.query(
      'INSERT INTO redirects (path, target) VALUES ($1, $2) ON CONFLICT (path) DO UPDATE SET target = EXCLUDED.target',
      [normalizePath(p), target],
    );
  }
  await loadRedirects();
  res.json({ ok: true, total: redirectMap.size });
}));

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const target = redirectMap.get(normalizePath(req.path));
  if (target) return res.redirect(301, target);
  next();
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Rota não encontrada' }));

// ---------- Site compilado ----------

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const indexFile = path.join(distDir, 'index.html');

if (fs.existsSync(indexFile)) {
  const indexHtml = fs.readFileSync(indexFile, 'utf8');
  app.use(express.static(distDir, { index: false, maxAge: '1h' }));

  // Injeta o conteúdo no HTML para a página já abrir com os textos certos
  app.get('*', asyncRoute(async (_req, res) => {
    let content = {};
    try {
      content = await loadContent();
    } catch (err) {
      console.error('Erro ao carregar conteúdo:', err);
    }
    const payload = JSON.stringify(content).replace(/</g, '\\u003c');
    res.set('Cache-Control', 'no-cache');
    let html = indexHtml.replace('</head>', `<script>window.__SITE_CONTENT__=${payload}</script></head>`);
    // Ícone da aba enviado no admin (Geral → Logo e ícones)
    const favicon = String(content.global?.favicon || '').trim();
    if (favicon) {
      const attr = favicon.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
      html = html.replace('<link rel="icon" href="/favicon.svg" />', `<link rel="icon" href="${attr}" />`);
    }
    res.type('html').send(html);
  }));
}

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Arquivo muito grande (máximo 90MB)' });
  }
  if (err.expose) return res.status(err.status || 400).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: 'Erro interno' });
});

await migrate();
await loadRedirects();
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
