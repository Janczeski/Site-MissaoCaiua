import { Button } from '@/components/ui/button';
import Carousel from '@/components/Carousel';
import Card from '@/components/Card';
import Map from '@/components/Map';
import Newsletter from '@/components/Newsletter';
import SmartLink from '@/components/SmartLink';
import { useContent } from '@/content/SiteContentContext';
import { usePublicNews, usePublicProjects } from '@/hooks/use-public-data';
import { Heart, Users, Target, Award, ArrowRight, MessageCircle } from 'lucide-react';

// Aceita só o número (com DDD) ou um link completo
const whatsappUrl = (value: string) => {
  const v = value.trim();
  if (!v) return '';
  if (/^https?:\/\//.test(v)) return v;
  const digits = v.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits.length <= 11 ? `55${digits}` : digits}` : '';
};

const Index = () => {
  const home = useContent('home');
  const { whatsapp } = useContent('global');
  const { data: projects = [] } = usePublicProjects();
  const { data: news = [] } = usePublicNews();
  const chatUrl = whatsappUrl(whatsapp);

  return (
    <div className="min-h-screen">
      {/* Hero Section com Carrossel */}
      <section className="relative">
        <Carousel items={home.slides} />
      </section>

      {/* Seção Sobre Nós Resumida */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-montserrat">
              {home.about.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-nunito leading-relaxed whitespace-pre-line">
              {home.about.text}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <Heart className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--c-accent)' }} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">{home.about.missionTitle}</h3>
                <p className="text-gray-600 font-nunito">{home.about.missionText}</p>
              </div>
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--c-primary)' }} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">{home.about.visionTitle}</h3>
                <p className="text-gray-600 font-nunito">{home.about.visionText}</p>
              </div>
              <div className="text-center">
                <Award className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--c-secondary)' }} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">{home.about.valuesTitle}</h3>
                <p className="text-gray-600 font-nunito">{home.about.valuesText}</p>
              </div>
            </div>
            {home.about.buttonText && (
              <Button asChild size="lg" style={{ backgroundColor: 'var(--c-primary)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-primary-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-primary)'}>
                <SmartLink to={home.about.buttonLink || '/quem-somos'}>
                  {home.about.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </SmartLink>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Seção Impacto em Números */}
      {home.impact.items.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
                {home.impact.title}
              </h2>
              <p className="text-lg text-gray-600 font-nunito">{home.impact.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {home.impact.items.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold mb-2 font-montserrat" style={{ color: 'var(--c-primary)' }}>
                    {item.number}
                  </div>
                  <div className="text-gray-600 font-nunito">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Seção Projetos com Mapa (só aparece com projetos ativos) */}
      {projects.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
                {home.projects.title}
              </h2>
              <p className="text-lg text-gray-600 font-nunito">{home.projects.subtitle}</p>
            </div>

            <div className="mb-12">
              <Map locations={projects} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.slice(0, 4).map((project) => (
                <Card
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  location={project.location}
                  link="/projetos"
                  linkText={home.projects.cardButton}
                  variant="project"
                />
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg" variant="outline">
                <SmartLink to="/projetos">
                  {home.projects.button}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </SmartLink>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Seção Como Ajudar */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
              {home.help.title}
            </h2>
            <p className="text-lg text-gray-600 font-nunito">{home.help.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="rounded-lg p-8 text-center" style={{ background: 'linear-gradient(to bottom right, color-mix(in srgb, var(--c-hero-bg) 13%, transparent), color-mix(in srgb, var(--c-secondary) 19%, transparent))' }}>
              <Heart className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--c-accent)' }} />
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">{home.help.donationTitle}</h3>
              <p className="text-gray-600 mb-6 font-nunito">{home.help.donationText}</p>
              <Button asChild style={{ backgroundColor: 'var(--c-accent)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent)'}>
                <SmartLink to={home.help.donationLink || '/doacao'}>{home.help.donationButton}</SmartLink>
              </Button>
            </div>

            <div className="rounded-lg p-8 text-center" style={{ background: 'linear-gradient(to bottom right, color-mix(in srgb, var(--c-tertiary) 13%, transparent), color-mix(in srgb, var(--c-cta-bg) 19%, transparent))' }}>
              <Users className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--c-primary)' }} />
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">{home.help.missionaryTitle}</h3>
              <p className="text-gray-600 mb-6 font-nunito">{home.help.missionaryText}</p>
              <Button asChild style={{ backgroundColor: 'var(--c-primary)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-primary-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-primary)'}>
                <SmartLink to={home.help.missionaryLink || '/como-ajudar'}>{home.help.missionaryButton}</SmartLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Notícias (só aparece com notícias ativas) */}
      {news.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
                {home.news.title}
              </h2>
              <p className="text-lg text-gray-600 font-nunito">{home.news.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.slice(0, 3).map((article) => (
                <Card
                  key={article.id}
                  title={article.title}
                  description={article.subtitle}
                  image={article.image}
                  date={article.date}
                  author={article.author}
                  link={`/noticias/${article.id}`}
                  linkText={home.news.cardButton}
                  variant="news"
                />
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg" variant="outline">
                <SmartLink to="/noticias">
                  {home.news.button}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </SmartLink>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <Newsletter />

      {/* Botão do WhatsApp (só aparece se configurado no admin) */}
      {chatUrl && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            asChild
            size="lg"
            className="rounded-full shadow-lg h-14 w-14 p-0"
            style={{ backgroundColor: 'var(--c-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-secondary)'}
          >
            <a href={chatUrl} target="_blank" rel="noopener noreferrer" title="Fale conosco" aria-label="Fale conosco">
              <MessageCircle className="h-6 w-6" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
