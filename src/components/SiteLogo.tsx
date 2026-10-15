import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useContent } from '@/content/SiteContentContext';

interface SiteLogoProps {
  variant: 'header' | 'footer' | 'mobile';
}

const SIZES = {
  header: { img: 'h-10 max-w-[200px]', icon: 'h-8 w-8', text: 'text-xl' },
  mobile: { img: 'h-8 max-w-[160px]', icon: 'h-6 w-6', text: 'text-lg' },
  footer: { img: 'h-10 max-w-[200px]', icon: 'h-8 w-8', text: 'text-xl' },
};

// Logo do site: imagem enviada no admin (Geral → Logo e ícones) ou o coração padrão
const SiteLogo = ({ variant }: SiteLogoProps) => {
  const { siteName, logo, logoFooter, showSiteName } = useContent('global');
  const [broken, setBroken] = useState(false);
  const src = (variant === 'footer' ? logoFooter || logo : logo).trim();
  const size = SIZES[variant];

  return (
    <span className="flex items-center space-x-2 min-w-0">
      {src && !broken ? (
        <img
          src={src}
          alt={showSiteName ? '' : siteName}
          onError={() => setBroken(true)}
          className={`${size.img} w-auto object-contain flex-shrink-0`}
        />
      ) : (
        <Heart
          className={`${size.icon} flex-shrink-0`}
          style={{ color: variant === 'footer' ? 'var(--c-accent)' : 'var(--c-primary)' }}
        />
      )}
      {showSiteName && (
        <span
          className={`${size.text} font-bold font-montserrat truncate ${variant === 'footer' ? '' : 'text-gray-900'}`}
        >
          {siteName}
        </span>
      )}
    </span>
  );
};

export default SiteLogo;
