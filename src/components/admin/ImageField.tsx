import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { uploadFile } from '@/lib/api';
import { toast } from 'sonner';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

interface ImageFieldProps {
  id?: string;
  value: string;
  onChange: (url: string) => void;
  previewClassName?: string;
}

// Envia uma imagem para o servidor ou aceita uma URL colada; mostra a prévia
const ImageField = ({ id, value, onChange, previewClassName = 'w-full h-36 object-cover' }: ImageFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem (JPG, PNG ou WEBP).');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error('Imagem muito grande. Máximo 8MB.');
      return;
    }

    setIsUploading(true);
    try {
      const { url } = await uploadFile(file);
      onChange(url);
      toast.success('Imagem enviada!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar imagem');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="sm:w-auto"
        >
          {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ImagePlus className="h-4 w-4 mr-2" />}
          {isUploading ? 'Enviando...' : 'Enviar imagem'}
        </Button>
        <Input
          id={id}
          placeholder="ou cole o endereço (URL) da imagem"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {value && (
        <div className="relative inline-block max-w-full">
          <img src={value} alt="Prévia" className={`rounded border bg-gray-50 ${previewClassName}`} />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 bg-white/90 hover:bg-white rounded-full p-1 shadow"
            aria-label="Remover imagem"
            title="Remover imagem"
          >
            <X className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageField;
