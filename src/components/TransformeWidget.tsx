import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

// Lê o UUID da campanha e o script do código colado no admin, como a Transforme.tech fornece:
// <div data-transforme-uuid="2551" ...></div> <script src="https://....transforme.solutions/widget-embed.js">
export const parseTransformeCode = (html: string) => {
  const uuid = html.match(/data-transforme-uuid\s*=\s*["']([^"']+)["']/i)?.[1].trim();
  const src = html.match(/<script[^>]+src\s*=\s*["']([^"']*widget-embed\.js[^"']*)["']/i)?.[1].trim();
  return uuid && src ? { uuid, src } : null;
};

interface TransformeWidgetProps {
  uuid: string;
  src: string;
  className?: string;
}

// Formulário de doação da Transforme.tech no modo "embed": só o formulário, sem a moldura da
// página de campanha, com altura ajustada ao conteúdo. O resto do visual fica por conta do site.
const TransformeWidget = ({ uuid, src, className }: TransformeWidgetProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    setReady(false);

    // O formulário avisa (postMessage) quando carrega e quando muda de altura
    let origin = '';
    try {
      origin = new URL(src, window.location.href).origin;
    } catch {
      /* src inválido: o aviso de carregamento some pelo tempo limite */
    }
    const onMessage = (event: MessageEvent) => {
      if (event.origin === origin) setReady(true);
    };
    window.addEventListener('message', onMessage);
    const timeout = window.setTimeout(() => setReady(true), 10000);

    const target = document.createElement('div');
    target.dataset.transformeUuid = uuid;
    target.dataset.transformeMode = 'embed';
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    container.replaceChildren(target, script);

    return () => {
      window.removeEventListener('message', onMessage);
      window.clearTimeout(timeout);
      container.replaceChildren();
    };
  }, [uuid, src]);

  return (
    <div className={`relative ${ready ? '' : 'min-h-[480px]'} ${className ?? ''}`}>
      <div ref={ref} className="[&_iframe]:block [&_iframe]:w-full [&_iframe]:border-0" />
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--c-primary)' }} />
          <span className="font-nunito text-sm">Carregando formulário de doação…</span>
        </div>
      )}
    </div>
  );
};

export default TransformeWidget;
