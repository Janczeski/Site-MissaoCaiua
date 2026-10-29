import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CampaignSlide } from '@/lib/api';

interface BannerCarouselProps {
  slides: CampaignSlide[];
  alt: string;
  interval?: number;
}

// Banners de campanha (já trazem o texto na imagem): só as imagens, sem sobreposição.
// No celular usa a versão vertical quando a campanha tem uma.
const BannerCarousel = ({ slides, alt, interval = 6000 }: BannerCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (current >= count) setCurrent(0);
  }, [current, count]);

  useEffect(() => {
    if (paused || count < 2) return;
    const timer = setInterval(() => setCurrent((i) => (i + 1) % count), interval);
    return () => clearInterval(timer);
  }, [paused, count, interval]);

  if (!count) return null;
  const go = (i: number) => setCurrent((i + count) % count);

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-md bg-gray-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide, i) => (
          <picture key={slide.desktop} className="w-full flex-shrink-0">
            {slide.mobile && <source media="(max-width: 640px)" srcSet={slide.mobile} />}
            <img
              src={slide.desktop}
              alt={i === 0 ? alt : ''}
              className="block w-full h-auto"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </picture>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            onClick={() => go(current - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/25 hover:bg-black/40 text-white p-2 transition-colors"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(current + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/25 hover:bg-black/40 text-white p-2 transition-colors"
            aria-label="Próximo banner"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`h-2.5 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-2.5 bg-white/60 hover:bg-white/80'}`}
                aria-label={`Ir para o banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerCarousel;
