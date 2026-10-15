import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Crop, ImagePlus, Loader2, X } from 'lucide-react';
import ImageCropDialog, { type CropOptions } from './ImageCropDialog';
import { uploadFile } from '@/lib/api';
import { shrinkImage, splitImageUrl } from '@/lib/crop';
import { toast } from 'sonner';

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

interface ImageFieldProps {
  id?: string;
  value: string;
  onChange: (url: string) => void;
  /** Formato em que a imagem aparece no site; sem isso, envia sem recorte */
  crop?: CropOptions;
}

// Envia uma imagem (com recorte no formato do site) ou aceita uma URL colada; mostra a prévia
const ImageField = ({ id, value, onChange, crop }: ImageFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState('imagem');
  const [cropOriginal, setCropOriginal] = useState<string | null>(null);

  const closeCrop = () => {
    if (cropSrc?.startsWith('blob:')) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  const upload = async (file: File) => {
    setIsUploading(true);
    try {
      const { url } = await uploadFile(file);
      onChange(url);
      toast.success('Imagem enviada!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar imagem');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const toFile = (blob: Blob, suffix = '') => new File([blob], `${fileName}${suffix}.jpg`, { type: 'image/jpeg' });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem (JPG, PNG ou WEBP).');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error('Imagem muito grande. Máximo 15MB.');
      return;
    }

    if (!crop) {
      await upload(file).catch(() => undefined);
      return;
    }
    setFileName(file.name.replace(/\.[^.]+$/, '') || 'imagem');
    setCropOriginal(null);
    setCropSrc(URL.createObjectURL(file));
  };

  const handleCropped = async (blob: Blob) => {
    setIsUploading(true);
    try {
      // Foto nova: guarda também a original (reduzida) para poder reposicionar depois
      let original = cropOriginal;
      if (!original && cropSrc) original = (await uploadFile(toFile(await shrinkImage(cropSrc, 2400), '-original'))).url;
      const { url } = await uploadFile(toFile(blob));
      onChange(original ? `${url}#original=${original}` : url);
      toast.success('Imagem aplicada!');
      closeCrop();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar imagem');
    } finally {
      setIsUploading(false);
    }
  };

  const reposition = () => {
    const { url, original } = splitImageUrl(value);
    setFileName((url.split('/').pop() || 'imagem').replace(/[?#].*$/, '').replace(/\.[^.]+$/, '') || 'imagem');
    // Recorta a partir da original quando existir; senão, da própria imagem
    setCropOriginal(original ?? (url.startsWith('/files/') ? null : url));
    setCropSrc(original ?? url);
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
          value={splitImageUrl(value).url}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {crop?.label && <p className="text-xs text-gray-500">Formato no site: {crop.label}.</p>}

      {value && (
        <div className="flex items-start gap-3">
          {/* Prévia no mesmo formato em que aparece no site */}
          <div
            className={`relative overflow-hidden border bg-gray-50 ${crop?.round ? 'rounded-full w-32' : 'rounded w-full max-w-xs'}`}
            style={{ aspectRatio: crop ? String(crop.aspect) : undefined }}
          >
            <img src={value} alt="Prévia" className={`w-full ${crop ? 'h-full object-cover' : 'h-36 object-cover'}`} />
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
          {crop && (
            <Button type="button" variant="outline" size="sm" onClick={reposition} disabled={isUploading}>
              <Crop className="h-4 w-4 mr-1" />
              Reposicionar
            </Button>
          )}
        </div>
      )}

      {crop && (
        <ImageCropDialog
          src={cropSrc}
          {...crop}
          onCancel={closeCrop}
          onConfirm={handleCropped}
        />
      )}
    </div>
  );
};

export default ImageField;
