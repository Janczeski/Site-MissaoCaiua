import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import SmartLink from '@/components/SmartLink';
import { useContent } from '@/content/SiteContentContext';
import RichText from '@/components/RichText';
import type { SiteContent } from '@/content/defaults';
import { Heart, Users, Target, Award, Calendar, MapPin, ArrowRight, ChevronLeft, ChevronRight, FileText, User } from 'lucide-react';

const transparencyIcons = [
  <Calendar className="h-8 w-8 mx-auto mb-4" style={{ color: 'var(--c-secondary)' }} />,
  <Users className="h-8 w-8 text-[var(--c-primary)] mx-auto mb-4" />,
  <MapPin className="h-8 w-8 mx-auto mb-4" style={{ color: 'var(--c-accent)' }} />,
];

type Member = SiteContent['about']['team'][number];

const TeamMember = ({ member, main }: { member: Member; main: boolean }) => {
  const [broken, setBroken] = useState(false);
  const size = main ? 'w-36 h-36' : 'w-28 h-28';
  return (
    <div className={`text-center ${main ? 'w-full sm:w-64' : 'w-full sm:w-56'}`}>
      <div className="mb-4">
        {member.image && !broken ? (
          <img
            src={member.image}
            alt={member.name}
            onError={() => setBroken(true)}
            className={`rounded-full mx-auto object-cover ${size}`}
          />
        ) : (
          <div className={`rounded-full mx-auto bg-gray-100 flex items-center justify-center ${size}`}>
            <User className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      <h3 className={`font-semibold text-gray-900 mb-1 font-montserrat ${main ? 'text-lg' : 'text-base'}`}>{member.name}</h3>
      <p className={`font-medium mb-2 font-nunito ${main ? '' : 'text-sm'}`} style={{ color: 'var(--c-primary)' }}>{member.role}</p>
      <p className="text-gray-600 text-sm font-nunito">{member.description}</p>
    </div>
  );
};

const About = () => {
  const about = useContent('about');
  const topRow = about.team.filter((m) => m.secondRow !== true);
  const bottomRow = about.team.filter((m) => m.secondRow === true);
  const timelineRef = useRef<HTMLDivElement>(null);

  const scrollTimeline = (direction: 'left' | 'right') => {
    timelineRef.current?.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 site-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">{about.heroTitle}</h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90">{about.heroSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center font-montserrat">
              {about.historyTitle}
            </h2>

            <div className="prose prose-lg max-w-none font-nunito">
              <RichText text={about.historyText} />
            </div>

            {/* Missão, Visão e Valores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center p-6 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--c-hero-bg) 13%, transparent)' }}>
                <Heart className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--c-accent)' }} />
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-montserrat">{about.missionTitle}</h3>
                <p className="text-gray-600 font-nunito">{about.missionText}</p>
              </div>

              <div className="text-center p-6 bg-[color-mix(in_srgb,var(--c-primary)_8%,transparent)] rounded-lg">
                <Target className="h-12 w-12 text-[var(--c-primary)] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-montserrat">{about.visionTitle}</h3>
                <p className="text-gray-600 font-nunito">{about.visionText}</p>
              </div>

              <div className="text-center p-6 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--c-secondary) 13%, transparent)' }}>
                <Award className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--c-secondary)' }} />
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-montserrat">{about.valuesTitle}</h3>
                <p className="text-gray-600 font-nunito">{about.valuesText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Linha do Tempo Horizontal */}
      {about.timeline.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center font-montserrat">
                {about.timelineTitle}
              </h2>

              <div className="relative">
                {/* Botões de navegação */}
                <button
                  onClick={() => scrollTimeline('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>

                <button
                  onClick={() => scrollTimeline('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  aria-label="Próximo"
                >
                  <ChevronRight className="h-6 w-6 text-gray-600" />
                </button>

                {/* Timeline Container */}
                <div
                  ref={timelineRef}
                  className="overflow-x-auto scrollbar-hide px-12"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className="flex space-x-8 pb-8">
                    {about.timeline.map((milestone, index) => (
                      <div key={index} className="flex-shrink-0 w-72">
                        <div className="relative">
                          {/* Linha conectora */}
                          {index < about.timeline.length - 1 && (
                            <div className="absolute top-8 left-full w-8 h-0.5 bg-[var(--c-secondary)]" />
                          )}

                          {/* Círculo do ano */}
                          <div className="flex justify-center mb-4">
                            <div className="bg-[var(--c-primary)] text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm shadow-lg">
                              {milestone.year}
                            </div>
                          </div>

                          {/* Card de conteúdo */}
                          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-100 hover:border-[var(--c-primary)] transition-all">
                            {milestone.title && (
                              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                                {milestone.title}
                              </h3>
                            )}
                            <p className="text-gray-600 text-sm font-nunito">{milestone.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indicação de scroll */}
                <div className="text-center mt-4 text-sm text-gray-500 font-nunito">{about.timelineHint}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Nossa Equipe */}
      {about.team.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center font-montserrat">
                {about.teamTitle}
              </h2>

              {/* Fileira de cima: principais; fileira de baixo: membros marcados no admin */}
              {[topRow, bottomRow].map((row, rowIndex) => row.length > 0 && (
                <div
                  key={rowIndex}
                  className={`flex flex-wrap justify-center gap-x-8 gap-y-10 ${rowIndex === 1 && topRow.length ? 'mt-12' : ''}`}
                >
                  {row.map((member, index) => (
                    <TeamMember key={index} member={member} main={rowIndex === 0} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Transparência */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-montserrat">
              {about.transparencyTitle}
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-nunito">{about.transparencyText}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {about.transparencyCards.map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  {transparencyIcons[index % transparencyIcons.length]}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">{card.title}</h3>
                  <p className="text-gray-600 text-sm font-nunito">{card.text}</p>
                </div>
              ))}
            </div>

            {about.transparencyButton && (
              <Button asChild size="lg" variant="outline" className="mt-8">
                <SmartLink to="/transparencia">
                  <FileText className="mr-2 h-4 w-4" />
                  {about.transparencyButton}
                </SmartLink>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 site-cta">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">{about.ctaTitle}</h2>
            <p className="text-xl mb-8 font-nunito opacity-90">{about.ctaText}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {about.ctaPrimaryText && (
                <Button asChild size="lg" style={{ backgroundColor: 'var(--c-accent)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent)'}>
                  <SmartLink to={about.ctaPrimaryLink || '/como-ajudar'}>
                    {about.ctaPrimaryText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </SmartLink>
                </Button>
              )}
              {about.ctaSecondaryText && (
                <Button asChild size="lg" variant="outline" className="border-white text-white bg-transparent" onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--c-cta-text)'; e.currentTarget.style.color = 'var(--c-cta-bg)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--c-cta-text)'; }}>
                  <SmartLink to={about.ctaSecondaryLink || '/doacao'}>
                    {about.ctaSecondaryText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </SmartLink>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
