import type { CropOptions } from '@/components/admin/ImageCropDialog';

// Formatos em que as imagens aparecem no site. Se mudar aqui, ajuste também as classes
// aspect-[...] dos componentes que exibem a imagem (Carousel, Card, Projects, News, NewsDetail).
export const IMAGE_FORMATS = {
  // Carrossel: 5:2 no computador; no celular (~390x500) aparece só a faixa central
  slide: { aspect: 5 / 2, maxWidth: 2000, mobileAspect: 0.78, label: 'panorâmico 5:2, largura total da página' },
  // Equipe: exibida em círculo
  team: { aspect: 1, round: true, maxWidth: 600, label: 'quadrado, exibido em círculo' },
  // Notícias e projetos: mesmo formato nos cards e nas páginas
  card: { aspect: 2, maxWidth: 1400, label: '2:1, igual nos cards e na página' },
} satisfies Record<string, CropOptions>;
