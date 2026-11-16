// Junta configuração do servidor, consentimento, rotas e o carregador do pixel.
// Fábrica sem acesso direto a window/document: index.ts cria a instância real; os testes, uma simulada.
import type { ConsentStore, MarketingConsent } from './consent.ts';
import type { MetaPixelController } from './metaPixel.ts';
import { createPageViewTracker } from './pageViews.ts';
import { isAdminPath, isTrackablePath } from './routes.ts';

export interface MetaPixelConfig {
  id: string;
  host: string;
}

const PIXEL_ID = /^\d{10,20}$/;

/**
 * Valida o que o servidor injetou em window.__SITE_CONFIG__. O servidor só injeta o pixel com
 * META_PIXEL_ENABLED=true no domínio canônico; aqui a regra é repetida no navegador.
 */
export function readMetaPixelConfig(raw: unknown, location: { hostname: string; pathname: string }): MetaPixelConfig | null {
  const pixel = (raw as { metaPixel?: unknown } | null | undefined)?.metaPixel as Partial<MetaPixelConfig> | null | undefined;
  if (!pixel || typeof pixel.id !== 'string' || typeof pixel.host !== 'string') return null;
  if (!PIXEL_ID.test(pixel.id)) return null;
  if (!pixel.host || pixel.host.toLowerCase() !== location.hostname.toLowerCase()) return null;
  if (isAdminPath(location.pathname)) return null;
  return { id: pixel.id, host: pixel.host.toLowerCase() };
}

export interface TrackingRuntime {
  /** Há algo a consentir: pixel configurado para este documento e ao menos uma rota liberada. */
  readonly enabled: boolean;
  readonly consent: ConsentStore;
  pixelLoaded(): boolean;
  onLocation(pathname: string): void;
  grant(): { persisted: boolean };
  deny(): { persisted: boolean };
  /**
   * Com o SDK carregado, sair para um caminho não liberado (inclui o admin) exige documento novo,
   * que não carrega o SDK. Assim a lista de rotas limita o SDK inteiro, não só os nossos PageViews.
   */
  needsFullNavigation(pathname: string): boolean;
  /** Encerra o SDK antes de uma navegação completa (não apaga cookies nem a escolha). */
  prepareFullNavigation(): void;
}

export function createTrackingRuntime(options: {
  config: MetaPixelConfig | null;
  allowedPaths: readonly string[];
  consent: ConsentStore;
  createPixel: (config: MetaPixelConfig) => MetaPixelController;
  clearCookies: () => void;
  reload: () => void;
}): TrackingRuntime {
  const { config, allowedPaths, consent, createPixel, clearCookies, reload } = options;
  const enabled = Boolean(config) && allowedPaths.length > 0;
  let pixel: MetaPixelController | null = null;
  // O documento está sendo substituído (revogação ou saída para rota não liberada):
  // nada mais é enviado nem carregado nesta página.
  let leaving = false;

  const isTrackable = (pathname: string) => isTrackablePath(pathname, allowedPaths);
  const pixelLoaded = () => pixel?.loaded ?? false;

  const pageViews = createPageViewTracker({
    isEligible: isTrackable,
    canTrack: () => enabled && !leaving && consent.get() === 'granted',
    ensurePixel: () => {
      if (!config) return false;
      pixel ??= createPixel(config);
      return pixel.start();
    },
    track: () => pixel?.trackPageView() ?? false,
  });

  const shutDown = () => {
    if (pixel) pixel.revoke();
    else clearCookies();
    // O SDK já carregado não pode ser descarregado: um documento novo encerra o script.
    // A recusa já está gravada (ou consent.get() já não é 'granted') antes da recarga.
    if (pixelLoaded() && !leaving) {
      leaving = true;
      reload();
    }
  };

  const leave = () => {
    leaving = true;
    pixel?.suspend();
  };

  consent.subscribe((value: MarketingConsent) => {
    if (value === 'granted') pageViews.retry();
    // Recusa nesta aba, em outra aba, ou armazenamento limpo
    else shutDown();
  });

  return {
    enabled,
    consent,
    pixelLoaded,
    onLocation(pathname) {
      if (leaving) return;
      consent.revalidate();
      if (leaving) return; // a revalidação pode ter revogado
      if (pixelLoaded() && !isTrackable(pathname)) {
        // Mudança de rota que escapou da proteção de navegação: o endereço já é o novo,
        // então recarregar abre o documento novo (sem SDK) nesse caminho.
        leave();
        reload();
        return;
      }
      pageViews.onLocation(pathname);
    },
    grant: () => consent.set(true),
    deny() {
      const before = consent.get();
      const result = consent.set(false);
      // Se já estava recusado, o subscribe não dispara: garante limpeza mesmo assim
      if (before === 'denied') shutDown();
      return result;
    },
    needsFullNavigation: (pathname) => pixelLoaded() && !isTrackable(pathname),
    prepareFullNavigation: leave,
  };
}
