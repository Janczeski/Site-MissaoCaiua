import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Eye, FileText, Film, ImagePlus, Link2, Loader2, Pencil } from 'lucide-react';
import RichText from '@/components/RichText';
import { uploadFile } from '@/lib/api';
import { toast } from 'sonner';

const LIMITS = { image: 15, video: 90, pdf: 30 } as const;
type Kind = keyof typeof LIMITS;

interface RichTextEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

// Campo de texto das notícias com botões para inserir imagens, vídeos, PDFs e links
const RichTextEditor = ({ id, value, onChange, required }: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<Kind>('image');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);

  // Insere um trecho na posição do cursor; blocos (mídia) ficam em parágrafo próprio
  const insert = (snippet: string, block = true) => {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const pre = block && before && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
    const post = block && !after.startsWith('\n\n') ? (after.startsWith('\n') ? '\n' : '\n\n') : '';
    const next = before + pre + snippet + post + after;
    onChange(next);
    requestAnimationFrame(() => {
      const pos = (before + pre + snippet).length;
      el?.focus();
      el?.setSelectionRange(pos, pos);
    });
  };

  const pick = (k: Kind) => {
    setKind(k);
    if (fileRef.current) {
      fileRef.current.accept = k === 'image' ? 'image/*' : k === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'application/pdf';
      fileRef.current.click();
    }
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;
    const tooBig = files.find((f) => f.size > LIMITS[kind] * 1024 * 1024);
    if (tooBig) {
      toast.error(`"${tooBig.name}" é muito grande. Máximo ${LIMITS[kind]}MB.`);
      return;
    }
    setUploading(true);
    try {
      const lines: string[] = [];
      for (const file of files) {
        const { url, name } = await uploadFile(file);
        lines.push(kind === 'pdf' ? `[${name.replace(/\.pdf$/i, '')}](${url})` : `![](${url})`);
      }
      insert(lines.join('\n'));
      toast.success(files.length > 1 ? `${files.length} arquivos inseridos` : 'Arquivo inserido');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar arquivo');
    } finally {
      setUploading(false);
    }
  };

  // Envolve o texto selecionado (insert substitui a seleção)
  const wrapBold = () => {
    const el = textareaRef.current;
    const selected = el ? value.slice(el.selectionStart, el.selectionEnd) : '';
    insert(`**${selected || 'texto em negrito'}**`, false);
  };

  const addLink = () => {
    const el = textareaRef.current;
    const selected = el ? value.slice(el.selectionStart, el.selectionEnd) : '';
    const url = prompt('Endereço do link (ex.: https://...)');
    if (!url) return;
    const label = selected || prompt('Texto do link') || url;
    insert(`[${label}](${url})`, false);
  };

  return (
    <div className="rounded-md border">
      <div className="flex flex-wrap items-center gap-1 border-b bg-gray-50 p-1.5">
        <Button type="button" size="sm" variant="ghost" onClick={() => pick('image')} disabled={uploading || preview} title="Inserir imagem (pode escolher várias para virar galeria)">
          <ImagePlus className="h-4 w-4 mr-1" /> Imagem
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => pick('video')} disabled={uploading || preview} title="Inserir vídeo MP4 (até 90MB)">
          <Film className="h-4 w-4 mr-1" /> Vídeo
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => pick('pdf')} disabled={uploading || preview} title="Inserir PDF">
          <FileText className="h-4 w-4 mr-1" /> PDF
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={addLink} disabled={preview} title="Inserir link">
          <Link2 className="h-4 w-4 mr-1" /> Link
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={wrapBold} disabled={preview} title="Negrito">
          <Bold className="h-4 w-4" />
        </Button>
        {uploading && <Loader2 className="h-4 w-4 animate-spin text-gray-500 ml-1" />}
        <Button type="button" size="sm" variant={preview ? 'default' : 'outline'} className="ml-auto" onClick={() => setPreview((p) => !p)}>
          {preview ? <Pencil className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
          {preview ? 'Editar' : 'Pré-visualizar'}
        </Button>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />
      </div>

      {preview ? (
        <div className="max-h-[60vh] overflow-y-auto p-4">
          <RichText text={value || 'Nada para mostrar ainda.'} />
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          id={id}
          rows={14}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder="Digite o conteúdo da notícia..."
          className="border-0 rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm"
        />
      )}
      <p className="border-t bg-gray-50 px-3 py-2 text-xs text-gray-500">
        Linha em branco separa parágrafos. Imagens seguidas viram galeria. Um link do YouTube sozinho na linha vira vídeo.
      </p>
    </div>
  );
};

export default RichTextEditor;
