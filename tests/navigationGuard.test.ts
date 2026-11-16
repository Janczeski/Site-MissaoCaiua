import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installNavigationGuard, type GuardWindow } from '../src/lib/tracking/navigationGuard.ts';

// Histórico e window simulados; nenhum SDK real.
type PopListener = { fn: (e: { stopImmediatePropagation(): void }) => void; capture: boolean };

function fakeWindow(start = 'https://missaocaiua.org.br/a') {
  const url = new URL(start);
  const native: unknown[][] = [];
  const listeners: PopListener[] = [];
  const move = (target: unknown) => {
    if (target !== undefined && target !== null) url.href = new URL(String(target), url.href).href;
  };
  const history = {
    pushState(...args: unknown[]) {
      native.push(['push', ...args]);
      move(args[2]);
    },
    replaceState(...args: unknown[]) {
      native.push(['replace', ...args]);
      move(args[2]);
    },
  };
  const win = {
    history,
    location: {
      get href() {
        return url.href;
      },
      get pathname() {
        return url.pathname;
      },
    },
    addEventListener(_type: 'popstate', fn: PopListener['fn'], capture: boolean) {
      listeners.push({ fn, capture });
    },
  };
  // Dispara popstate como o navegador: ouvintes em captura primeiro
  const popTo = (path: string) => {
    url.pathname = path;
    let stopped = false;
    const ran: string[] = [];
    const event = { stopImmediatePropagation: () => (stopped = true) };
    for (const l of [...listeners.filter((x) => x.capture), ...listeners.filter((x) => !x.capture)]) {
      if (stopped) break;
      l.fn(event);
      ran.push(l.capture ? 'guard' : 'other');
    }
    return ran;
  };
  return { win, native, popTo };
}

const allowed = new Set(['/a', '/b']);

function install(sdkLoaded: () => boolean) {
  const f = fakeWindow();
  const left: [string, string][] = [];
  installNavigationGuard({
    win: f.win as unknown as GuardWindow,
    mustLeave: (p) => sdkLoaded() && !allowed.has(p),
    leave: (href, mode) => left.push([href, mode]),
  });
  return { ...f, left };
}

test('sem SDK carregado: histórico passa direto', () => {
  const g = install(() => false);
  g.win.history.pushState({}, '', '/admin');
  assert.deepEqual(g.left, []);
  assert.equal(g.native.length, 1);
});

test('SDK carregado: pushState/replaceState para rota não liberada viram documento novo, sem tocar o histórico', () => {
  const g = install(() => true);
  g.win.history.pushState({}, '', '/b');
  assert.equal(g.native.length, 1);
  g.win.history.pushState({}, '', '/projetos?filtro=x');
  g.win.history.replaceState({}, '', '/admin');
  g.win.history.replaceState({ idx: 0 }, ''); // sem URL: mesma página
  assert.deepEqual(g.left, [
    ['https://missaocaiua.org.br/projetos?filtro=x', 'assign'],
    ['https://missaocaiua.org.br/admin', 'replace'],
  ]);
  assert.equal(g.native.length, 2);
  assert.equal(g.win.location.pathname, '/b');
});

test('SDK envolvendo o histórico depois: nosso envoltório continua por fora e não há recursão', () => {
  const g = install(() => true);
  const seenBySdk: unknown[] = [];
  // Padrão comum de "history hook": guarda o original e o chama
  const orig = g.win.history.pushState;
  g.win.history.pushState = function (this: unknown, ...args: unknown[]) {
    const result = orig.apply(this, args);
    seenBySdk.push(args[2]);
    return result;
  };
  g.win.history.pushState({}, '', '/b');
  g.win.history.pushState({}, '', '/nao-liberada');
  assert.deepEqual(seenBySdk, ['/b'], 'o SDK não vê a rota não liberada');
  assert.equal(g.native.length, 1);
  assert.deepEqual(g.left, [['https://missaocaiua.org.br/nao-liberada', 'assign']]);
});

test('voltar/avançar para rota não liberada: interrompe os demais ouvintes e recarrega', () => {
  const g = install(() => true);
  g.win.addEventListener('popstate', () => undefined, false); // ex.: ouvinte do SDK ou do roteador
  assert.deepEqual(g.popTo('/b'), ['guard', 'other']);
  assert.deepEqual(g.popTo('/admin'), ['guard']);
  assert.deepEqual(g.left, [['https://missaocaiua.org.br/admin', 'reload']]);
});
