import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/format';

interface CardProps {
  title: string;
  description: string;
  image: string;
  link?: string;
  linkText?: string;
  location?: string;
  beneficiaries?: number;
  date?: string;
  author?: string;
  variant?: 'project' | 'news' | 'default';
}

const Card = ({ 
  title, 
  description, 
  image, 
  link, 
  linkText = "Saiba mais",
  location,
  beneficiaries,
  date,
  author,
  variant = 'default'
}: CardProps) => {

  const truncateText = (text: string, maxLength: number = 120) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative aspect-[2/1] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--c-hero-bg) 25%, transparent), color-mix(in srgb, var(--c-primary) 25%, transparent))' }} />
        )}
        {variant === 'news' && date && (
          <div className="absolute top-4 left-4 text-white px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--c-primary)' }}>
            {formatDate(date)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 font-montserrat line-clamp-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4 font-nunito leading-relaxed">
          {truncateText(description)}
        </p>

        {/* Meta Information */}
        <div className="space-y-2 mb-4">
          {location && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-2 text-[var(--c-secondary)]" />
              <span>{location}</span>
            </div>
          )}
          
          {beneficiaries && (
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2 text-[var(--c-primary)]" />
              <span>{beneficiaries} beneficiários</span>
            </div>
          )}

          {author && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" style={{ color: 'var(--c-accent)' }} />
              <span>Por {author}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {link && (
          <div className="mt-4">
            {link.startsWith('/') ? (
              <Button asChild variant="outline" className="w-full">
                <Link to={link}>{linkText}</Link>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(link, '_blank')}
              >
                {linkText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;