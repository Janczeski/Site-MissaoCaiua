// Garante que o SDK da Meta só exista em documentos cuja rota está liberada.
//
// Com o SDK carregado, qualquer mudança de rota para um caminho NÃO liberado vira documento novo
// (que não carrega o SDK), ANTES de o histórico mudar no documento atual:
// - pushState/replaceState (Link, navigate()): nosso envoltório fica sempre por fora, mesmo que o
//   SDK tente envolver o histórico depois (a atribuição dele é guardada como "interna");
// - voltar/avançar (popstate): ouvinte em captura registrado antes de o SDK existir; interrompe os
//   demais ouvintes (inclusive os do SDK e do roteador) e recarrega já no endereço novo.
// Assim não dependemos de `disablePushState` para que o SDK não observe a navegação.
// Instalado só quando o nosso pixel vai carregar; com o pixel desativado, nada é alterado.

type HistoryMethod = 'pushState' | 'replaceState';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GuardWindow {
  history: Record<HistoryMethod, (...args: any[]) => unknown>;
  location: { href: string; pathname: string };
  addEventListener(type: 'popstate', listener: (event: { stopImmediatePropagation(): void }) => void, capture: boolean): void;
}

export interface GuardOptions {
  win: GuardWindow;
  /** true quando o SDK está carregado e o caminho não está liberado */
  mustLeave(pathname: string): boolean;
  /** Abre `href` em documento novo. `replace`: sem nova entrada no histórico; `reload`: endereço já atual. */
  leave(href: string, mode: 'assign' | 'replace' | 'reload'): void;
}

export function installNavigationGuard({ win, mustLeave, leave }: GuardOptions): void {
  const { history } = win;

  for (const method of ['pushState', 'replaceState'] as const) {
    const original = history[method];
    let inner = original;
    let depth = 0;

    const guarded = function (this: unknown, ...args: any[]) {
      const url = args[2];
      if (depth === 0 && url !== undefined && url !== null) {
        let target: URL | null = null;
        try {
          target = new URL(String(url), win.location.href);
        } catch {
          target = null;
        }
        if (target && target.origin === new URL(win.location.href).origin && mustLeave(target.pathname)) {
          leave(target.href, method === 'pushState' ? 'assign' : 'replace');
          return undefined;
        }
      }
      // Reentrada: um envoltório interno (ex.: do SDK) chamando o que ele achava ser o original
      if (depth > 0) return original.apply(history, args);
      depth += 1;
      try {
        return inner.apply(history, args);
      } finally {
        depth -= 1;
      }
    };

    Object.defineProperty(history, method, {
      configurable: true,
      enumerable: true,
      get: () => guarded,
      set: (fn: unknown) => {
        if (typeof fn === 'function' && fn !== guarded) inner = fn as typeof inner;
      },
    });
  }

  win.addEventListener(
    'popstate',
    (event) => {
      if (!mustLeave(win.location.pathname)) return;
      event.stopImmediatePropagation();
      leave(win.location.href, 'reload');
    },
    true,
  );
}
