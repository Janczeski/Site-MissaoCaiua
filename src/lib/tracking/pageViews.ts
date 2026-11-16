// Um PageView por "visita" a uma página elegível.
//
// Uma visita começa quando o pathname muda em relação ao anterior. Por isso:
// - A → B → A gera três visitas (não há deduplicação permanente por URL);
// - voltar/avançar entre páginas diferentes gera uma visita a cada passo;
// - mudar só o #hash ou só o ?filtro na mesma página não gera nova visita;
// - o efeito duplicado do React StrictMode (mesmo pathname duas vezes) não gera nova visita.
// Se o consentimento chegar com a visita em andamento, `retry` registra a visita atual uma vez.

export interface PageViewDeps {
  isEligible(pathname: string): boolean;
  /** Configuração + consentimento + runtime ativo */
  canTrack(): boolean;
  /** Carrega o pixel se preciso; false se não foi possível */
  ensurePixel(): boolean;
  track(): boolean;
}

export interface PageViewTracker {
  onLocation(pathname: string): void;
  retry(): void;
}

export function createPageViewTracker(deps: PageViewDeps): PageViewTracker {
  let visit: { pathname: string; tracked: boolean } | null = null;

  const attempt = () => {
    if (!visit || visit.tracked) return;
    if (!deps.isEligible(visit.pathname) || !deps.canTrack()) return;
    if (!deps.ensurePixel()) return;
    if (deps.track()) visit.tracked = true;
  };

  return {
    onLocation(pathname) {
      if (!visit || visit.pathname !== pathname) visit = { pathname, tracked: false };
      attempt();
    },
    retry: attempt,
  };
}
