export interface PixelArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    // Necessário para recortar imagens de outros sites (ex.: Unsplash) sem bloquear o canvas
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Não foi possível carregar a imagem para recorte.'));
    img.src = src;
  });
}

// Recorta a área escolhida e redimensiona para no máximo `maxWidth` (sem ampliar fotos pequenas)
export async function cropImage(src: string, area: PixelArea, maxWidth: number): Promise<Blob> {
  const img = await loadImage(src);
  const width = Math.round(Math.min(maxWidth, area.width));
  const height = Math.round(width * (area.height / area.width));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Seu navegador não suporta recorte de imagens.');

  // Fundo branco para PNGs com transparência (o resultado é JPEG)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Falha ao gerar a imagem recortada.'))),
        'image/jpeg',
        0.88,
      );
    } catch {
      reject(new Error('Esta imagem não permite recorte. Baixe-a e envie pelo botão "Enviar imagem".'));
    }
  });
}

// Reduz a imagem inteira para no máximo `maxWidth` (guardada como original para reposicionar depois)
export async function shrinkImage(src: string, maxWidth: number): Promise<Blob> {
  const img = await loadImage(src);
  return cropImage(src, { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight }, maxWidth);
}

// A URL da imagem recortada carrega a original no fragmento: "/files/a/foto.jpg#original=/files/b/foto.jpg"
export const splitImageUrl = (value: string) => {
  const [url, fragment = ''] = value.split('#original=');
  return { url, original: fragment || null };
};
