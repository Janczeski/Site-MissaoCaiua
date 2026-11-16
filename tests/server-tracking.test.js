import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { publicSiteConfig, readMetaPixelEnv, requestHost, serializeForScript } from '../server/tracking.js';

const ID = '1494309866239727';
const HOST = 'missaocaiua.org.br';
const env = (extra) => ({ META_PIXEL_ID: ID, CANONICAL_HOST: HOST, ...extra });

test('flag: só o texto "true" habilita; o resto mantém desativado', () => {
  assert.equal(readMetaPixelEnv({}), null);
  for (const value of [undefined, '', 'false', '1', 'yes', 'TRUE']) {
    assert.equal(readMetaPixelEnv(env({ META_PIXEL_ENABLED: value })), null, String(value));
  }
  assert.deepEqual(readMetaPixelEnv(env({ META_PIXEL_ENABLED: 'true' })), { id: ID, canonicalHost: HOST });
});

test('flag ligada sem ID válido ou sem domínio canônico: desativado', () => {
  assert.equal(readMetaPixelEnv(env({ META_PIXEL_ENABLED: 'true', META_PIXEL_ID: '123abc' })), null);
  assert.equal(readMetaPixelEnv(env({ META_PIXEL_ENABLED: 'true', CANONICAL_HOST: '' })), null);
});

test('.env.example mantém o pixel desativado', () => {
  const example = fs.readFileSync(new URL('../.env.example', import.meta.url), 'utf8');
  assert.match(example, /^META_PIXEL_ENABLED=false$/m);
});

test('config injetada só no domínio canônico e fora do admin', () => {
  const pixel = readMetaPixelEnv(env({ META_PIXEL_ENABLED: 'true' }));
  assert.deepEqual(publicSiteConfig(pixel, { host: HOST, path: '/' }), { metaPixel: { id: ID, host: HOST } });
  for (const host of ['localhost', '127.0.0.1', 'www.missaocaiua.org.br', 'hnkwnrrrltr1gi65kwlqk22t.89.117.75.124.sslip.io']) {
    assert.deepEqual(publicSiteConfig(pixel, { host, path: '/' }), { metaPixel: null }, host);
  }
  for (const path of ['/admin', '/admin/login', '/Admin/', '/ADMIN/LOGIN', '/%61dmin', '/%41dmin/login']) {
    assert.deepEqual(publicSiteConfig(pixel, { host: HOST, path }), { metaPixel: null }, path);
  }
  assert.deepEqual(publicSiteConfig(null, { host: HOST, path: '/' }), { metaPixel: null });
});

test('domínio vem do Host, não de X-Forwarded-Host', () => {
  assert.equal(requestHost({ headers: { host: 'localhost:3051', 'x-forwarded-host': HOST } }), 'localhost');
  assert.equal(requestHost({ headers: { host: 'MissaoCaiua.org.br' } }), HOST);
  assert.equal(requestHost({ headers: {} }), '');
});

test('serialização segura para <script>', () => {
  const value = { a: '</script><script>alert(1)</script>', b: '<!--', c: 'a&b', d: '\u2028\u2029' };
  const out = serializeForScript(value);
  assert.doesNotMatch(out, new RegExp('[<>&\u2028\u2029]'));
  assert.deepEqual(JSON.parse(out), value);
});
