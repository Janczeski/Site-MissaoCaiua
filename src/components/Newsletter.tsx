import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import FormUnavailableNotice from '@/components/FormUnavailableNotice';
import { useContent } from '@/content/SiteContentContext';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const { newsletter: t } = useContent('global');

  // Ainda não há envio real: o formulário fica desativado (ver FormUnavailableNotice)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

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
          
          <div className="max-w-md mx-auto mb-4">
            <FormUnavailableNotice>
              Inscrições temporariamente indisponíveis: a newsletter ainda não recebe inscrições por este site.
            </FormUnavailableNotice>
          </div>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto" aria-disabled="true">
            <fieldset disabled className="flex flex-col sm:flex-row gap-4 disabled:opacity-60">
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
              className="h-12 px-8 whitespace-nowrap"
              style={{ backgroundColor: 'var(--c-accent)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent)'}
            >
              {t.button}
            </Button>
            </fieldset>
          </form>
          {/* t.privacy promete cancelamento de inscrição: volta quando o envio real existir */}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;