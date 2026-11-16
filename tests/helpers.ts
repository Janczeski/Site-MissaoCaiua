// Ambiente simulado: nenhum script é baixado e nenhuma requisição sai para a Meta.
// O fbq criado pelo carregador fica só com a fila (o fbevents.js nunca executa).
import { createConsentStore, type StorageLike } from '../src/lib/tracking/consent.ts';
import { clearPixelCookies, createMetaPixel, type PixelWindow } from '../src/lib/tracking/metaPixel.ts';
import { createTrackingRuntime, type MetaPixelConfig } from '../src/lib/tracking/runtime.ts';

export const PIXEL_ID = '1494309866239727';
export const HOST = 'missaocaiua.org.br';

export function fakeStorage(options: { failGet?: boolean; failSet?: boolean } = {}) {
  const map = new Map<string, string>();
  const storage: StorageLike & { map: Map<string, string> } = {
    map,
    getItem(key) {
      if (options.failGet) throw new Error('SecurityError');
      return map.has(key) ? map.get(key)! : null;
    },
    setItem(key, value) {
      if (options.failSet) throw new Error('QuotaExceededError');
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
  };
  return storage;
}

export function fakeDocument() {
  const appended: { async: boolean; src: string }[] = [];
  const cookieWrites: string[] = [];
  const doc = {
    head: {
      appendChild(node: unknown) {
        appended.push(node as { async: boolean; src: string });
        return node;
      },
    },
    createElement: () => ({ async: false, src: '' }),
    get cookie() {
      return '';
    },
    set cookie(value: string) {
      cookieWrites.push(value);
    },
  };
  return { doc, appended, cookieWrites };
}

export function setup(options: {
  config?: MetaPixelConfig | null;
  allowed?: readonly string[];
  storage?: StorageLike | null;
  win?: PixelWindow;
  onReload?: () => void;
  /** Simula o fbevents.js já executado: ao ser criado, o fbq passa a "enviar" direto (callMethod) */
  sdkRuns?: boolean;
} = {}) {
  const storage = options.storage === undefined ? fakeStorage() : options.storage;
  const consent = createConsentStore(() => storage);
  const win: PixelWindow = options.win ?? {};
  const dom = fakeDocument();
  let reloads = 0;
  // Chamadas que o SDK simulado processou (o que de fato seria enviado/aplicado)
  const processed: unknown[][] = [];
  const runtime = createTrackingRuntime({
    config: options.config === undefined ? { id: PIXEL_ID, host: HOST } : options.config,
    allowedPaths: options.allowed ?? ['/a', '/b', '/doacao'],
    consent,
    createPixel: (config) =>
      createMetaPixel({
        pixelId: config.id,
        win,
        doc: dom.doc,
        hostname: HOST,
        onBeforeLoad: () => {
          if (!options.sdkRuns) return;
          // O "script" executa logo após ser inserido: processa a fila e passa a processar direto
          const fbq = win.fbq!;
          for (const args of fbq.queue as ArrayLike<unknown>[]) processed.push(Array.from(args));
          fbq.queue.length = 0;
          fbq.callMethod = (...args: unknown[]) => processed.push(args);
        },
      }),
    clearCookies: () => clearPixelCookies(dom.doc, HOST),
    reload: () => {
      reloads += 1;
      options.onReload?.();
    },
  });
  const calls = () => [
    ...processed,
    ...((win.fbq?.queue as ArrayLike<unknown>[] | undefined) ?? []).map((args) => Array.from(args)),
  ];
  return {
    runtime,
    consent,
    storage,
    win,
    dom,
    calls,
    pageViews: () => calls().filter((c) => c[0] === 'track' && c[1] === 'PageView').length,
    inits: () => calls().filter((c) => c[0] === 'init').length,
    reloads: () => reloads,
  };
}
