import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle } from 'lucide-react';
import { useContent } from '@/content/SiteContentContext';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { newsletter: t } = useContent('global');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsLoading(true);
    
    // Simular envio
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <div id="newsletter" className="py-12 site-cta">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--c-primary)' }} />
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-montserrat">
                {t.successTitle}
              </h3>
              <p className="text-gray-600 font-nunito">
                {t.successText}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="newsletter" className="py-12 site-cta">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <Mail className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-montserrat">
              {t.title}
            </h3>
            <p className="text-white opacity-90 font-nunito">
              {t.text}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border-0 h-12 text-gray-900 placeholder-gray-500"
              required
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-12 px-8 whitespace-nowrap"
              style={{ backgroundColor: 'var(--c-accent)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent)'}
            >
              {isLoading ? '...' : t.button}
            </Button>
          </form>
          
          <p className="text-white opacity-80 text-sm mt-4 font-nunito">
            {t.privacy}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;