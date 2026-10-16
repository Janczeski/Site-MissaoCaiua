import { Fragment, type ReactNode } from 'react';
import SmartLink from '@/components/SmartLink';
import { FileText } from 'lucide-react';

// Formato simples usado no conteúdo das notícias (editável como texto no admin):
//   linha em branco      → novo parágrafo
//   ## Título            → subtítulo
//   - item               → lista
//   ![legenda](url)      → imagem (várias seguidas viram galeria; .mp4/.webm vira vídeo)
//   [texto](url)         → link (.pdf vira botão de documento quando sozinho na linha)
//   https://youtu.be/... → vídeo do YouTube quando sozinho na linha
//   **texto**            → negrito

const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;
const LINK_LINE = /^\[([^\]]+)\]\(([^)\s]+)\)$/;
const VIDEO_EXT = /\.(mp4|webm|mov)(\?|#|$)/i;

function youtubeId(url: string) {
  const m = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(url.trim());
  return m?.[1] ?? null;
}

// Links e negrito dentro de um parágrafo
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s)]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      out.push(
        <SmartLink key={key++} to={m[2]} className="underline" style={{ color: 'var(--c-primary)' }}>
          {m[1]}
        </SmartLink>,
      );
    } else if (m[3]) {
      out.push(<strong key={key++}>{m[3]}</strong>);
    } else {
      out.push(
        <a key={key++} href={m[4]} target="_blank" rel="noopener noreferrer" className="underline break-all" style={{ color: 'var(--c-primary)' }}>
          {m[4]}
        </a>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const Media = ({ alt, url, single }: { alt: string; url: string; single: boolean }) =>
  VIDEO_EXT.test(url) ? (
    <video src={url} controls preload="metadata" playsInline className="w-full rounded-lg bg-black max-h-[80vh]" />
  ) : (
    <a href={url.split('#')[0]} target="_blank" rel="noopener noreferrer" className="block">
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className={`w-full rounded-lg object-cover ${single ? 'max-h-[80vh] object-contain bg-gray-100' : 'aspect-square'}`}
      />
    </a>
  );

const RichText = ({ text }: { text: string }) => {
  const blocks = text.replace(/\r\n/g, '\n').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="space-y-5 text-gray-700 leading-relaxed">
      {blocks.map((block, i) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);

        // Imagens/vídeos (uma ou várias seguidas)
        const media = lines.map((l) => IMAGE_LINE.exec(l));
        if (media.every(Boolean)) {
          const items = media.map((m) => ({ alt: m![1], url: m![2] }));
          if (items.length === 1) {
            return (
              <figure key={i}>
                <Media {...items[0]} single />
                {items[0].alt && <figcaption className="text-sm text-gray-500 mt-2 text-center">{items[0].alt}</figcaption>}
              </figure>
            );
          }
          return (
            <div key={i} className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {items.map((item, j) => (
                <Media key={j} {...item} single={false} />
              ))}
            </div>
          );
        }

        if (lines.length === 1) {
          const line = lines[0];
          const yt = youtubeId(line);
          if (yt) {
            return (
              <div key={i} className="aspect-video">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${yt}`}
                  title="Vídeo do YouTube"
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          }
          const link = LINK_LINE.exec(line);
          if (link && /\.pdf(\?|#|$)/i.test(link[2])) {
            return (
              <a
                key={i}
                href={link[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
              >
                <FileText className="h-6 w-6 flex-shrink-0" style={{ color: 'var(--c-accent)' }} />
                <span className="font-medium" style={{ color: 'var(--c-primary)' }}>{link[1]}</span>
              </a>
            );
          }
          if (line.startsWith('#')) {
            return (
              <h2 key={i} className="text-2xl font-bold text-gray-900 font-montserrat pt-2">
                {inline(line.replace(/^#+\s*/, ''))}
              </h2>
            );
          }
        }

        if (lines.every((l) => /^[-•–]\s+/.test(l))) {
          return (
            <ul key={i} className="list-disc pl-6 space-y-1">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^[-•–]\s+/, ''))}</li>)}
            </ul>
          );
        }

        return (
          <p key={i} className="text-lg">
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};

export default RichText;
