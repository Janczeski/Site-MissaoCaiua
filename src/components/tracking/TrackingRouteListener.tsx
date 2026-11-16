import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackingRuntime } from '@/lib/tracking';

// Informa cada navegação ao runtime de rastreamento (que decide se há PageView) e garante que,
// com o pixel carregado, links para rotas não liberadas (inclui o admin) abram um documento novo,
// que não carrega o pixel. Navegação programática e voltar/avançar: ver navigationGuard.ts.
export default function TrackingRouteListener() {
  const { pathname } = useLocation();

  useEffect(() => {
    trackingRuntime.onLocation(pathname);
  }, [pathname]);

  useEffect(() => {
    // Captura no document: roda antes do onClick do <Link>, que respeita event.defaultPrevented
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.hasAttribute('download')) return;
      if (anchor.target && anchor.target !== '_self') return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || !trackingRuntime.needsFullNavigation(url.pathname)) return;
      event.preventDefault();
      trackingRuntime.prepareFullNavigation();
      window.location.assign(url.href);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
