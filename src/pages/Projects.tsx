import { useLayoutEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Map from '@/components/Map';
import SmartLink from '@/components/SmartLink';
import { Button } from '@/components/ui/button';
import { useContent } from '@/content/SiteContentContext';
import { usePublicCampaigns, usePublicProjects } from '@/hooks/use-public-data';
import type { CampaignItem, ProjectItem } from '@/lib/api';
import { ArrowRight, MapPin, Grid, Map as MapIcon, FolderOpen } from 'lucide-react';

const formatMoney = (value: number) => `R$ ${value.toLocaleString('pt-BR')}`;

// Filtro das campanhas da Transforme.tech (as demais opções são as categorias dos projetos)
const CAMPAIGNS = 'campanhas';

// Projetos e campanhas aparecem juntos na lista, no mesmo formato de cartão
interface ListItem {
  key: string;
  title: string;
  badge: string;
  description: string;
  image: string | null;
  /** Banner de campanha (já tem texto na imagem): mantém a proporção original, sem corte */
  banner: boolean;
  location: string;
  href: string;
  supportHref: string;
  supportLabel: string;
  showGoal: boolean;
  raised: number;
  goal: number;
  date: string;
}

// Texto do cartão limitado a 9 linhas; "ver mais" só aparece quando o texto foi cortado
const ClampedText = ({ text, href, moreLabel }: { text: string; href: string; moreLabel: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [clamped, setClamped] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  return (
    <div className="mb-4">
      <p ref={ref} className="text-gray-600 font-nunito leading-relaxed whitespace-pre-line line-clamp-[9]">
        {text}
      </p>
      {clamped && (
        <SmartLink
          to={href}
          className="group mt-2 inline-flex items-center gap-1 text-sm font-semibold"
          style={{ color: 'var(--c-primary)' }}
        >
          {moreLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </SmartLink>
      )}
    </div>
  );
};

const Projects = () => {
  const t = useContent('projects');
  const { data: allProjects = [], isLoading } = usePublicProjects();
  const { data: allCampaigns = [], isLoading: isLoadingCampaigns } = usePublicCampaigns();
  const campaigns = allCampaigns.filter((c) => c.title);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Categorias montadas a partir dos projetos publicados
  const categories = Array.from(new Set(allProjects.map((p) => p.category).filter(Boolean)));

  // O filtro fica no endereço (ex.: /projetos?filtro=campanhas) para poder ser compartilhado
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('filtro') || 'all';
  const selectedCategory =
    (requested === CAMPAIGNS && campaigns.length) || categories.includes(requested) ? requested : 'all';
  const setSelectedCategory = (category: string) =>
    setSearchParams(category === 'all' ? {} : { filtro: category }, { replace: true });
  const showingCampaigns = selectedCategory === CAMPAIGNS;

  const filteredProjects = selectedCategory === 'all'
    ? allProjects
    : allProjects.filter((project) => project.category === selectedCategory);

  const fromProject = (p: ProjectItem): ListItem => ({
    key: `p${p.id}`,
    title: p.title,
    badge: p.category,
    description: p.description,
    image: p.image || null,
    banner: false,
    location: p.location,
    href: `/projetos/${p.id}`,
    supportHref: p.donation_link || t.supportLink || '/como-ajudar',
    supportLabel: t.supportButton,
    showGoal: p.show_goal && p.goal > 0,
    raised: p.raised,
    goal: p.goal,
    date: p.created_at || '',
  });

  // Campanha: a foto de fundo combina com os cartões dos projetos; sem ela, usa o banner
  const fromCampaign = (c: CampaignItem): ListItem => ({
    key: `c${c.id}`,
    title: c.title || '',
    badge: t.campaignBadge,
    description: (c.summary || c.tagline || '').replace(/\*\*/g, ''),
    image: c.background || c.slides?.[0]?.desktop || null,
    banner: !c.background && Boolean(c.slides?.length),
    location: '',
    href: `/campanhas/${c.uuid}`,
    supportHref: `/campanhas/${c.uuid}`,
    supportLabel: t.campaignSupportButton,
    showGoal: Boolean(c.showRaised && c.goal),
    raised: c.raised ?? 0,
    goal: c.goal ?? 0,
    date: c.created_at || '',
  });

  // "Todos": projetos e campanhas misturados, do mais recente para o mais antigo
  const items: ListItem[] = showingCampaigns
    ? campaigns.map(fromCampaign)
    : selectedCategory === 'all'
      ? [...allProjects.map(fromProject), ...campaigns.map(fromCampaign)].sort((a, b) => b.date.localeCompare(a.date))
      : filteredProjects.map(fromProject);

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

      {!isLoading && !isLoadingCampaigns && allProjects.length === 0 && campaigns.length === 0 ? (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 text-center max-w-xl">
            <FolderOpen className="h-14 w-14 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3 font-montserrat">{t.emptyTitle}</h2>
            <p className="text-gray-600 font-nunito">{t.emptyText}</p>
          </div>
        </section>
      ) : (
        <>
          {/* Filtros e Controles */}
          <section className="py-8 bg-white border-b">
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                {/* Filtros por Categoria */}
                <div className="flex flex-wrap gap-2">
                  {['all', ...categories].map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="text-sm"
                    >
                      {category === 'all' ? t.allLabel : category}
                    </Button>
                  ))}
                  {campaigns.length > 0 && (
                    <Button
                      variant={showingCampaigns ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(CAMPAIGNS)}
                      className="text-sm"
                    >
                      {t.campaignsLabel}
                    </Button>
                  )}
                </div>

                {/* Controles de Visualização (campanhas não têm localização no mapa) */}
                <div className={`flex gap-2 ${showingCampaigns ? 'invisible' : ''}`}>
                  <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                    <Grid className="h-4 w-4 mr-2" />
                    {t.gridLabel}
                  </Button>
                  <Button variant={viewMode === 'map' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('map')}>
                    <MapIcon className="h-4 w-4 mr-2" />
                    {t.mapLabel}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Visualização em Mapa */}
          {viewMode === 'map' && !showingCampaigns && (
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">{t.mapTitle}</h2>
                  <p className="text-gray-600 font-nunito">{t.mapSubtitle}</p>
                </div>
                <Map locations={filteredProjects} />
              </div>
            </section>
          )}

          {/* Visualização em Grade */}
          {(viewMode === 'grid' || showingCampaigns) && (
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                    {showingCampaigns ? t.campaignsLabel : selectedCategory === 'all' ? t.allLabel : selectedCategory}
                  </h2>
                  <p className="text-gray-600 font-nunito">
                    {items.length} {showingCampaigns ? t.campaignsCountLabel : t.countLabel}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {items.map((item) => {
                    const percent = item.showGoal ? (item.raised / item.goal) * 100 : 0;
                    return (
                      <div key={item.key} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                        {/* Imagem */}
                        {item.image && (
                          <SmartLink to={item.href} className={`block overflow-hidden ${item.banner ? 'aspect-[16/5]' : 'aspect-[2/1]'}`}>
                            <img
                              src={item.image}
                              alt={item.title}
                              loading="lazy"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </SmartLink>
                        )}

                        {/* Conteúdo */}
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 font-montserrat">
                              <SmartLink to={item.href} className="hover:underline underline-offset-4">{item.title}</SmartLink>
                            </h3>
                            {item.badge && (
                              <span
                                className="text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap"
                                style={{ backgroundColor: 'color-mix(in srgb, var(--c-hero-bg) 13%, transparent)', color: 'var(--c-primary)' }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>

                          {item.description && <ClampedText text={item.description} href={item.href} moreLabel={t.readMore} />}

                          {item.location && (
                            <div className="flex items-center text-gray-500 text-sm mb-6">
                              <MapPin className="h-4 w-4 mr-2 text-[var(--c-secondary)]" />
                              <span>{item.location}</span>
                            </div>
                          )}

                          {/* Barra de Progresso de Arrecadação */}
                          {item.showGoal && (
                            <div className="mb-6">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">{t.goalLabel}</span>
                                <span className="text-sm font-medium text-gray-900">{percent.toFixed(0)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                <div
                                  className="h-3 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: 'var(--c-primary)' }}
                                />
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {t.raisedLabel}: <span className="font-semibold text-gray-900">{formatMoney(item.raised)}</span>
                                </span>
                                <span className="text-gray-600">
                                  {t.goalShortLabel}: <span className="font-semibold text-gray-900">{formatMoney(item.goal)}</span>
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Botão de Ação */}
                          <div className="mt-auto">
                            <Button
                              asChild
                              className="w-full"
                              style={{ backgroundColor: 'var(--c-accent)' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent-hover)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent)'}
                            >
                              <SmartLink to={item.supportHref}>{item.supportLabel}</SmartLink>
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Estatísticas Gerais */}
      {t.stats.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-montserrat">{t.statsTitle}</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {t.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="text-3xl md:text-4xl font-bold mb-2 font-montserrat"
                      style={{ color: ['var(--c-primary)', 'var(--c-secondary)', 'var(--c-accent)', 'var(--c-tertiary)'][index % 4] }}
                    >
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-nunito">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 site-cta">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">{t.ctaTitle}</h2>
            <p className="text-xl mb-8 font-nunito opacity-90">{t.ctaText}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {t.ctaPrimaryText && (
                <Button asChild size="lg" style={{ backgroundColor: 'var(--c-accent)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent)'}>
                  <SmartLink to={t.ctaPrimaryLink || '/doacao'}>{t.ctaPrimaryText}</SmartLink>
                </Button>
              )}
              {t.ctaSecondaryText && (
                <Button asChild size="lg" variant="outline" className="border-white" style={{ backgroundColor: 'transparent', color: 'var(--c-cta-text)', borderColor: 'var(--c-cta-text)' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--c-cta-text)'; e.currentTarget.style.color = 'var(--c-cta-bg)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--c-cta-text)'; }}>
                  <SmartLink to={t.ctaSecondaryLink || '/como-ajudar'}>{t.ctaSecondaryText}</SmartLink>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
