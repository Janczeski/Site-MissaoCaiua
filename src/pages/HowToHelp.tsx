import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SmartLink from '@/components/SmartLink';
import FormUnavailableNotice from '@/components/FormUnavailableNotice';
import { useContent } from '@/content/SiteContentContext';
import { Heart, Users, Gift, BookOpen, Home, Stethoscope, Check } from 'lucide-react';

const donateIcons = [Heart, Users, Gift];
const volunteerIcons = [BookOpen, Stethoscope, Home];

const HowToHelp = () => {
  const t = useContent('help');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Ainda não há envio real: o formulário fica desativado (ver FormUnavailableNotice)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 site-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">{t.heroTitle}</h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90">{t.heroSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Formas de Doar */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center font-montserrat">
              {t.waysTitle}
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 font-nunito">{t.waysSubtitle}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {t.ways.map((way, index) => {
                const IconComponent = donateIcons[index % donateIcons.length];
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow flex flex-col">
                    <IconComponent className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--c-primary)' }} />
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-montserrat">{way.title}</h3>
                    <p className="text-gray-600 mb-6 font-nunito flex-grow">{way.description}</p>
                    {way.buttonText && (
                      <Button asChild className="w-full" style={{ backgroundColor: 'var(--c-accent)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent)'}>
                        <SmartLink to={way.buttonLink || '/doacao'}>{way.buttonText}</SmartLink>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Impacto das Doações */}
            {t.usage.length > 0 && (
              <div className="rounded-lg p-8" style={{ backgroundColor: 'color-mix(in srgb, var(--c-hero-bg) 13%, transparent)' }}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center font-montserrat">{t.usageTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {t.usage.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: 'var(--c-primary)' }} />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Voluntariado */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center font-montserrat">
              {t.volunteerTitle}
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 font-nunito">{t.volunteerSubtitle}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {t.volunteer.map((opportunity, index) => {
                const IconComponent = volunteerIcons[index % volunteerIcons.length];
                return (
                  <div key={index} className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-[var(--c-primary)] transition-colors">
                    <IconComponent className="h-12 w-12 mb-4" style={{ color: 'var(--c-secondary)' }} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">{opportunity.title}</h3>
                    <p className="text-gray-600 font-nunito">{opportunity.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Formulário de Interesse */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center font-montserrat">{t.formTitle}</h3>
              <div className="max-w-2xl mx-auto mb-6">
                <FormUnavailableNotice>
                  Formulário temporariamente indisponível: o cadastro de interesse por este site ainda não está
                  funcionando, e nada pode ser enviado por aqui no momento.
                </FormUnavailableNotice>
              </div>
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto" aria-disabled="true">
                <fieldset disabled className="disabled:opacity-60">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="name">{t.formName}</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t.formEmail}</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Label htmlFor="phone">{t.formPhone}</Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <Label htmlFor="message">{t.formMessage}</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder={t.formMessagePlaceholder}
                  />
                </div>

                <Button type="submit" className="w-full" style={{ backgroundColor: 'var(--c-primary)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-primary-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-primary)'}>
                  {t.formButton}
                </Button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 text-white site-cta">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">{t.ctaTitle}</h2>
          <p className="text-xl mb-8 font-nunito max-w-2xl mx-auto">{t.ctaText}</p>
          {t.ctaButton && (
            <Button asChild size="lg" className="text-lg px-8 py-6" style={{ backgroundColor: 'var(--c-accent)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent)'}>
              <SmartLink to={t.ctaLink || '/doacao'}>
                <Heart className="mr-2 h-5 w-5" />
                {t.ctaButton}
              </SmartLink>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default HowToHelp;
