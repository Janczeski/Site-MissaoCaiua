import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONSENT_STORAGE_KEY } from '../src/lib/tracking/consent.ts';
import { META_PIXEL_SCRIPT_SRC } from '../src/lib/tracking/metaPixel.ts';
import { META_PIXEL_ALLOWED_PATHS, isAdminPath, isTrackablePath } from '../src/lib/tracking/routes.ts';
import { readMetaPixelConfig } from '../src/lib/tracking/runtime.ts';
import { HOST, PIXEL_ID, fakeStorage, setup } from './helpers.ts';

const at = (pathname: string, hostname = HOST) => ({ hostname, pathname });

// ---------- Configuração ----------

test('lista de rotas liberadas: só as páginas revisadas', () => {
  assert.deepEqual(META_PIXEL_ALLOWED_PATHS, [
    '/', '/quem-somos', '/como-ajudar', '/doacao', '/campanhas/2363', '/noticias', '/transparencia', '/contato',
  ]);
  for (const path of ['/', '/doacao', '/Doacao/', '/campanhas/2363', '/noticias', '/contato']) {
    assert.equal(isTrackablePath(path), true, path);
  }
  // Sensíveis (pendentes de revisão), admin, APIs, campanhas não listadas e páginas inexistentes
  for (const path of [
    '/projetos', '/projetos/1', '/projetos/2', '/noticias/83', '/campanhas/9999',
    '/admin', '/admin/login', '/%61dmin', '/api/content', '/pagina-inexistente', '/doacao/extra',
    '/politica-de-privacidade', '/Politica-de-Privacidade/',
  ]) {
    assert.equal(isTrackablePath(path), false, path);
  }
});

test('config do navegador: exige pixel válido, mesmo domínio e fora do admin', () => {
  const ok = { metaPixel: { id: PIXEL_ID, host: HOST } };
  assert.deepEqual(readMetaPixelConfig(ok, at('/')), { id: PIXEL_ID, host: HOST });
  assert.equal(readMetaPixelConfig(undefined, at('/')), null);
  assert.equal(readMetaPixelConfig({ metaPixel: null }, at('/')), null); // flag desligada no servidor
  assert.equal(readMetaPixelConfig(ok, at('/', 'localhost')), null);
  assert.equal(readMetaPixelConfig(ok, at('/', 'hnkwnrrrltr1gi65kwlqk22t.89.117.75.124.sslip.io')), null);
  assert.equal(readMetaPixelConfig({ metaPixel: { id: 'abc', host: HOST } }, at('/')), null);
  assert.equal(readMetaPixelConfig(ok, at('/admin')), null); // entrada direta no admin
  assert.equal(readMetaPixelConfig(ok, at('/Admin/login')), null);
});

test('flag desativada (sem config): nada carrega mesmo com aceite', () => {
  const s = setup({ config: null });
  s.runtime.grant();
  s.runtime.onLocation('/a');
  assert.equal(s.runtime.enabled, false);
  assert.equal(s.win.fbq, undefined);
  assert.equal(s.dom.appended.length, 0);
});

test('lista de rotas vazia: banner indisponível e nada carrega', () => {
  const s = setup({ allowed: [] });
  s.runtime.grant();
  s.runtime.onLocation('/');
  s.runtime.onLocation('/doacao');
  assert.equal(s.runtime.enabled, false);
  assert.equal(s.win.fbq, undefined);
  assert.equal(s.dom.appended.length, 0);
});

test('sem escolha e com recusa: nada carrega', () => {
  const s = setup();
  s.runtime.onLocation('/a');
  assert.equal(s.win.fbq, undefined);
  s.runtime.deny();
  s.runtime.onLocation('/b');
  assert.equal(s.win.fbq, undefined);
  assert.equal(s.dom.appended.length, 0);
});

test('falha de armazenamento: aceite não carrega o pixel', () => {
  for (const storage of [fakeStorage({ failSet: true }), fakeStorage({ failGet: true }), null]) {
    const s = setup({ storage });
    s.runtime.onLocation('/a');
    assert.equal(s.runtime.grant().persisted, false);
    s.runtime.onLocation('/b');
    assert.equal(s.win.fbq, undefined);
    assert.equal(s.dom.appended.length, 0);
  }
});

// ---------- Aceite em configuração elegível ----------

test('aceite: um script, configuração automática desligada antes do init, sem correspondência avançada', () => {
  const s = setup();
  s.runtime.onLocation('/a');
  assert.equal(s.win.fbq, undefined, 'nada antes da escolha');
  s.runtime.grant();

  assert.equal(s.dom.appended.length, 1);
  assert.equal(s.dom.appended[0].src, META_PIXEL_SCRIPT_SRC);
  assert.equal(s.dom.appended[0].async, true);
  // O rastreador de histórico do SDK fica ligado: é ele que envia os PageViews das navegações internas
  assert.equal(s.win.fbq!.disablePushState, undefined);
  assert.deepEqual(s.calls(), [
    ['set', 'autoConfig', false, PIXEL_ID],
    ['init', PIXEL_ID],
    ['track', 'PageView'],
  ]);
});

// O SDK real descarta fbq('track', 'PageView') repetido no mesmo documento; as visitas seguintes
// (push, voltar/avançar) são enviadas pelo rastreador de histórico dele, não por chamadas nossas.
test('A → B → A e voltar/avançar: só o 1º PageView do documento é manual; init continua único', () => {
  for (const sdkRuns of [false, true]) {
    const s = setup({ sdkRuns });
    s.runtime.grant();
    for (const path of ['/a', '/b', '/a', '/b']) s.runtime.onLocation(path);
    assert.equal(s.pageViews(), 1);
    assert.equal(s.inits(), 1);
    assert.equal(s.dom.appended.length, 1);
  }
});

test('StrictMode (efeito executado duas vezes) e mudança só de hash: sem duplicidade', () => {
  const s = setup();
  s.runtime.grant();
  s.runtime.onLocation('/a');
  s.runtime.onLocation('/a'); // StrictMode: montagem → desmontagem → montagem
  s.runtime.onLocation('/a'); // /a#secao: o pathname não muda
  assert.equal(s.pageViews(), 1);
});

test('aceite no meio da visita registra a página atual uma vez; aceitar de novo não duplica', () => {
  const s = setup();
  s.runtime.onLocation('/nao-liberada');
  s.runtime.grant();
  assert.equal(s.win.fbq, undefined, 'rota não liberada não carrega o SDK');
  s.runtime.onLocation('/a');
  assert.equal(s.pageViews(), 1);
  s.runtime.grant();
  assert.equal(s.pageViews(), 1);
});

test('SDK carregado e ida a rota não liberada: documento novo, sem evento nesta página', () => {
  const s = setup({ sdkRuns: true });
  s.runtime.grant();
  s.runtime.onLocation('/a');
  assert.equal(s.pageViews(), 1);
  assert.equal(s.runtime.needsFullNavigation('/nao-liberada'), true);
  assert.equal(s.runtime.needsFullNavigation('/b'), false);

  // Mudança que escapou da proteção (o endereço já mudou): recarrega
  s.runtime.onLocation('/nao-liberada');
  assert.equal(s.reloads(), 1);
  assert.deepEqual(s.calls().at(-1), ['consent', 'revoke']);
  assert.equal(s.consent.get(), 'granted', 'a escolha do visitante continua');
  assert.equal(s.dom.cookieWrites.length, 0);
  // Até o documento novo abrir, nada mais é enviado nem recarregado de novo
  s.runtime.onLocation('/a');
  s.runtime.onLocation('/outra');
  assert.equal(s.pageViews(), 1);
  assert.equal(s.reloads(), 1);
});

test('sem SDK carregado, rotas não liberadas seguem pela navegação normal', () => {
  const s = setup();
  s.runtime.grant();
  s.runtime.onLocation('/nao-liberada');
  assert.equal(s.runtime.needsFullNavigation('/admin'), false);
  assert.equal(s.reloads(), 0);
});

test('fbq de terceiros já presente: não reaproveita nem inicializa de novo', () => {
  const foreign = Object.assign(() => {}, { queue: [] });
  const s = setup({ win: { fbq: foreign } });
  s.runtime.grant();
  s.runtime.onLocation('/a');
  assert.equal(s.win.fbq, foreign);
  assert.equal(foreign.queue.length, 0);
  assert.equal(s.dom.appended.length, 0);
});

// ---------- Revogação ----------

test('revogação: para na hora, revoke no SDK, cookies apagados, recusa gravada antes de recarregar', () => {
  let storedAtReload: string | undefined;
  const storage = fakeStorage();
  const s = setup({ storage, sdkRuns: true, onReload: () => (storedAtReload = storage.map.get(CONSENT_STORAGE_KEY)) });
  s.runtime.grant();
  s.runtime.onLocation('/a');
  assert.equal(s.pageViews(), 1);

  s.runtime.deny();
  assert.deepEqual(s.calls().at(-1), ['consent', 'revoke']);
  assert.equal(s.reloads(), 1);
  assert.equal(JSON.parse(storedAtReload!).marketing, false);
  for (const name of ['_fbp', '_fbc']) {
    assert.ok(s.dom.cookieWrites.some((c) => c.startsWith(`${name}=;`) && c.includes('Max-Age=0') && !c.includes('Domain=')));
    assert.ok(s.dom.cookieWrites.some((c) => c.startsWith(`${name}=;`) && c.includes(`Domain=.${HOST}`)));
    assert.ok(s.dom.cookieWrites.some((c) => c.startsWith(`${name}=;`) && c.includes(`Domain=${HOST}`)));
  }

  // Até a recarga terminar, nenhuma navegação gera evento; aceite em outra aba não reativa
  s.runtime.onLocation('/b');
  storage.map.set(CONSENT_STORAGE_KEY, JSON.stringify({ version: 1, marketing: true, date: new Date().toISOString() }));
  s.consent.handleStorageEvent(CONSENT_STORAGE_KEY);
  s.runtime.onLocation('/a');
  assert.equal(s.pageViews(), 1);
  assert.equal(s.calls().filter((c) => c[0] === 'consent' && c[1] === 'grant').length, 0);
});

test('revogação antes de o fbevents.js executar: fila descartada (nem init nem PageView)', () => {
  const s = setup();
  s.runtime.grant();
  s.runtime.onLocation('/a');
  assert.equal(s.pageViews(), 1); // ainda só na fila
  s.runtime.deny();
  assert.deepEqual(s.calls(), [['consent', 'revoke']]);
  assert.equal(s.reloads(), 1);
});

test('revogação em outra aba encerra o pixel nesta aba', () => {
  const storage = fakeStorage();
  const s = setup({ storage, sdkRuns: true });
  s.runtime.grant();
  s.runtime.onLocation('/a');

  // Outra aba grava a recusa; o navegador avisa com o evento storage
  storage.map.set(CONSENT_STORAGE_KEY, JSON.stringify({ version: 1, marketing: false, date: new Date().toISOString() }));
  s.consent.handleStorageEvent(CONSENT_STORAGE_KEY);

  assert.deepEqual(s.calls().at(-1), ['consent', 'revoke']);
  assert.equal(s.reloads(), 1);
  s.runtime.onLocation('/b');
  assert.equal(s.pageViews(), 1);
});

test('armazenamento apagado sem evento storage: a próxima navegação revalida e encerra', () => {
  for (const wipe of ['clear', 'fail'] as const) {
    const storage = fakeStorage();
    const s = setup({ storage, sdkRuns: true });
    s.runtime.grant();
    s.runtime.onLocation('/a');
    if (wipe === 'clear') storage.map.clear();
    else
      storage.getItem = () => {
        throw new Error('SecurityError');
      };
    s.runtime.onLocation('/b');
    assert.equal(s.pageViews(), 1, wipe);
    assert.equal(s.reloads(), 1, wipe);
    assert.notEqual(s.consent.get(), 'granted', wipe);
  }
});

test('recusar sem o pixel carregado: limpa cookies e não recarrega', () => {
  const s = setup();
  s.runtime.deny();
  assert.equal(s.reloads(), 0);
  assert.ok(s.dom.cookieWrites.some((c) => c.startsWith('_fbp=;')));
  assert.equal(s.win.fbq, undefined);
});

test('recusar com fbq de terceiros: não apaga os cookies dele nem chama o fbq dele', () => {
  const calls: unknown[][] = [];
  const foreign = Object.assign((...args: unknown[]) => void calls.push(args), { queue: [] });
  const s = setup({ win: { fbq: foreign } });
  s.runtime.grant();
  s.runtime.onLocation('/a');
  s.runtime.deny();
  assert.equal(s.dom.cookieWrites.length, 0);
  assert.deepEqual(calls, []);
  assert.equal(s.reloads(), 0);
});

// ---------- Admin ----------

test('ida ao admin com o pixel carregado: encerra o SDK e recarrega, sem PageView', () => {
  const s = setup({ allowed: ['/a', '/admin'], sdkRuns: true }); // mesmo se alguém liberar /admin por engano
  s.runtime.grant();
  s.runtime.onLocation('/a');
  for (const path of ['/admin', '/Admin/login', '/%61dmin']) assert.equal(s.runtime.needsFullNavigation(path), true, path);

  s.runtime.onLocation('/admin');
  assert.equal(s.pageViews(), 1);
  assert.deepEqual(s.calls().at(-1), ['consent', 'revoke']);
  assert.equal(s.reloads(), 1);
  assert.equal(s.dom.cookieWrites.length, 0, 'ir ao admin não apaga a escolha nem os cookies do visitante');
  assert.equal(s.consent.get(), 'granted');
});

test('prepareFullNavigation: nada mais é enviado nesta página', () => {
  const s = setup({ sdkRuns: true });
  assert.equal(s.runtime.needsFullNavigation('/admin'), false);
  s.runtime.grant();
  s.runtime.onLocation('/a');
  s.runtime.prepareFullNavigation();
  s.runtime.onLocation('/b');
  assert.equal(s.pageViews(), 1);
  assert.equal(isAdminPath('/administracao'), false);
  assert.equal(isAdminPath('/%61dmin/login'), true);
});

// ---------- Widget de doação ----------

test('widget de doação: rotas liberadas não são interceptadas e nada além do fbevents.js é inserido', () => {
  const s = setup({ allowed: ['/doacao', '/campanhas/:uuid'] });
  s.runtime.grant();
  s.runtime.onLocation('/doacao');
  for (const path of ['/doacao', '/campanhas/2551']) {
    assert.equal(s.runtime.needsFullNavigation(path), false, path);
  }
  assert.equal(s.runtime.needsFullNavigation('/projetos/1'), true);
  assert.deepEqual(
    s.dom.appended.map((n) => n.src),
    [META_PIXEL_SCRIPT_SRC],
  );
});
