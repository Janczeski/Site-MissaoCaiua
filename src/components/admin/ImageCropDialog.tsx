import { useEffect, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from 'sonner';
import { cropImage } from '@/lib/crop';

export interface CropOptions {
  /** Proporção largura/altura em que a imagem aparece no site */
  aspect: number;
  /** Recorte redondo (ex.: fotos da equipe) */
  round?: boolean;
  /** Largura máxima do arquivo gerado, em pixels */
  maxWidth?: number;
  /** Proporção visível no celular (mostra uma marcação tracejada) */
  mobileAspect?: number;
  /** Descrição do formato mostrada ao usuário */
  label?: string;
}

interface ImageCropDialogProps extends CropOptions {
  src: string | null;
  onCancel: () => void;
  onConfirm: (blob: Blob) => Promise<void> | void;
}

const ImageCropDialog = ({ src, aspect, round, maxWidth = 1600, mobileAspect, label, onCancel, onConfirm }: ImageCropDialogProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [cropSize, setCropSize] = useState<{ width: number; height: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Cada imagem nova começa centralizada e sem zoom
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setArea(null);
  }, [src]);

  const confirm = async () => {
    if (!src || !area) return;
    setIsSaving(true);
    try {
      await onConfirm(await cropImage(src, area, maxWidth));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao recortar imagem');
    } finally {
      setIsSaving(false);
    }
  };

  const mobileGuide = mobileAspect && cropSize
    ? { width: Math.min(cropSize.width, cropSize.height * mobileAspect), height: cropSize.height }
    : null;

  return (
    <Dialog open={Boolean(src)} onOpenChange={(open) => { if (!open && !isSaving) onCancel(); }}>
      <DialogContent className="max-w-4xl w-[calc(100vw-2rem)]">
        <DialogHeader>
          <DialogTitle>Posicionar imagem</DialogTitle>
          <DialogDescription>
            Arraste para posicionar e use o zoom para ajustar. A área clara é exatamente o que vai aparecer no site
            {label ? ` (${label})` : ''}.
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full h-[55vh] min-h-[280px] bg-gray-900 rounded-md overflow-hidden">
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={round ? 'round' : 'rect'}
              minZoom={1}
              maxZoom={4}
              showGrid={!round}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setArea(pixels)}
              onCropSizeChange={setCropSize}
            />
          )}
          {mobileGuide && (
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-yellow-300"
              style={{ width: mobileGuide.width, height: mobileGuide.height }}
            >
              <span className="absolute top-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-yellow-300 px-1.5 py-0.5 text-[11px] font-semibold text-gray-900">
                visível no celular
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ZoomOut className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <Slider
            value={[zoom]}
            min={1}
            max={4}
            step={0.01}
            onValueChange={([value]) => setZoom(value)}
            aria-label="Zoom"
          />
          <ZoomIn className="h-4 w-4 text-gray-500 flex-shrink-0" />
        </div>

        {mobileAspect && (
          <p className="text-xs text-gray-500">
            No computador aparece a área clara inteira; no celular, só o que está dentro da marcação amarela. Deixe o
            principal da foto (rostos, pessoas) dentro dela.
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="button" onClick={confirm} disabled={!area || isSaving} style={{ backgroundColor: '#3b660a' }}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isSaving ? 'Enviando...' : 'Aplicar recorte'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropDialog;
