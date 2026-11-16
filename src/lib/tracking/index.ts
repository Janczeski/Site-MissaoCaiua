// Instância real do runtime de rastreamento (navegador).
import { createConsentStore, CONSENT_STORAGE_KEY, type StorageLike } from './consent.ts';
import { clearPixelCookies, createMetaPixel, hasForeignFbq, type PixelWindow } from './metaPixel.ts';
import { installNavigationGuard, type GuardWindow } from './navigationGuard.ts';
import { META_PIXEL_ALLOWED_PATHS } from './routes.ts';
import { createTrackingRuntime, readMetaPixelConfig } from './runtime.ts';

declare global {
  interface Window {
    /** Injetado pelo servidor (server/tracking.js) */
    __SITE_CONFIG__?: unknown;
  }
}

const safeLocalStorage = (): StorageLike | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const consent = createConsentStore(safeLocalStorage);
const pixelWindow = window as unknown as PixelWindow;

export const trackingRuntime: ReturnType<typeof createTrackingRuntime> = createTrackingRuntime({
  config: readMetaPixelConfig(window.__SITE_CONFIG__, window.location),
  allowedPaths: META_PIXEL_ALLOWED_PATHS,
  consent,
  createPixel: (config) =>
    createMetaPixel({
      pixelId: config.id,
      win: pixelWindow,
      doc: document,
      hostname: window.location.hostname,
      // Antes do fbevents.js existir: nenhuma mudança de rota para caminho não liberado
      // acontece no mesmo documento do SDK (ver navigationGuard.ts)
      onBeforeLoad: () =>
        installNavigationGuard({
          win: window as unknown as GuardWindow,
          mustLeave: (pathname) => trackingRuntime.needsFullNavigation(pathname),
          leave: (href, mode) => {
            trackingRuntime.prepareFullNavigation();
            if (mode === 'assign') window.location.assign(href);
            else if (mode === 'replace') window.location.replace(href);
            else window.location.reload();
          },
        }),
    }),
  // Com fbq de terceiros na página, os cookies são dele: este consentimento não o controla
  clearCookies: () => {
    if (!hasForeignFbq(pixelWindow)) clearPixelCookies(document, window.location.hostname);
  },
  reload: () => window.location.reload(),
});

// Página restaurada do cache de voltar/avançar com o SDK: a escolha pode ter mudado enquanto ela
// estava congelada (eventos storage não chegam). Documento novo relê tudo do zero.
window.addEventListener('pageshow', (event) => {
  if (event.persisted && trackingRuntime.pixelLoaded()) window.location.reload();
});

// Dados do site apagados nas configurações do navegador não geram evento storage
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') consent.revalidate();
});

// Mudanças feitas em outras abas
window.addEventListener('storage', (event) => {
  if (event.storageArea && event.storageArea !== safeLocalStorage()) return;
  if (event.key === null || event.key === CONSENT_STORAGE_KEY) consent.handleStorageEvent(event.key);
});

/** Só em `npm run dev`: /?previewConsent mostra o banner (o pixel continua sem carregar). */
export const consentPreview =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has('previewConsent');

/** Há algo a consentir: banner e "Preferências de cookies" só aparecem nesse caso. */
export const cookieBannerAvailable = trackingRuntime.enabled || consentPreview;

// "Preferências de cookies" no rodapé reabre o banner
type Listener = () => void;
const preferenceListeners = new Set<Listener>();

export const cookiePreferences = {
  open() {
    preferenceListeners.forEach((listener) => listener());
  },
  subscribe(listener: Listener) {
    preferenceListeners.add(listener);
    return () => {
      preferenceListeners.delete(listener);
    };
  },
};
