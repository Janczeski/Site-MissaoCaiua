import { useEffect, useRef } from 'react';

interface EmbedHtmlProps {
  html: string;
  className?: string;
}

// Insere um código de incorporação (iframe ou <script>) colado no admin.
// Scripts inseridos via innerHTML não executam, então cada um é recriado para rodar.
const EmbedHtml = ({ html, className }: EmbedHtmlProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    container.innerHTML = html;
    container.querySelectorAll('script').forEach((old) => {
      const script = document.createElement('script');
      for (const attr of Array.from(old.attributes)) script.setAttribute(attr.name, attr.value);
      script.text = old.text;
      // Mantém a ordem de execução dos scripts externos
      if (script.src && !old.hasAttribute('async')) script.async = false;
      old.replaceWith(script);
    });

    return () => container.replaceChildren();
  }, [html]);

  return <div ref={ref} className={className} />;
};

export default EmbedHtml;
