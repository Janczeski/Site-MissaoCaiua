import { useState } from 'react';
import Map from '@/components/Map';
import SmartLink from '@/components/SmartLink';
import { Button } from '@/components/ui/button';
import { useContent } from '@/content/SiteContentContext';
import { usePublicProjects } from '@/hooks/use-public-data';
import { MapPin, Grid, Map as MapIcon, FolderOpen } from 'lucide-react';

const formatMoney = (value: number) => `R$ ${value.toLocaleString('pt-BR')}`;

const Projects = () => {
  const t = useContent('projects');
  const { data: allProjects = [], isLoading } = usePublicProjects();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categorias montadas a partir dos projetos publicados
  const categories = Array.from(new Set(allProjects.map((p) => p.category).filter(Boolean)));

  const filteredProjects = selectedCategory === 'all'
    ? allProjects
    : allProjects.filter((project) => project.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#a0c93a' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">{t.heroTitle}</h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90">{t.heroSubtitle}</p>
          </div>
        </div>
      </section>

      {!isLoading && allProjects.length === 0 ? (
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
                </div>

                {/* Controles de Visualização */}
                <div className="flex gap-2">
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
          {viewMode === 'map' && (
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
          {viewMode === 'grid' && (
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                    {selectedCategory === 'all' ? t.allLabel : selectedCategory}
                  </h2>
                  <p className="text-gray-600 font-nunito">
                    {filteredProjects.length} {t.countLabel}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredProjects.map((project) => {
                    const showGoal = project.show_goal && project.goal > 0;
                    const percent = showGoal ? (project.raised / project.goal) * 100 : 0;
                    return (
                      <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                        {/* Imagem */}
                        {project.image && (
                          <div className="aspect-[2/1] overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Conteúdo */}
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 font-montserrat">{project.title}</h3>
                            {project.category && (
                              <span
                                className="text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap"
                                style={{ backgroundColor: '#a0c93a20', color: '#3b660a' }}
                              >
                                {project.category}
                              </span>
                            )}
                          </div>

                          <p className="text-gray-600 mb-4 font-nunito leading-relaxed whitespace-pre-line">
                            {project.description}
                          </p>

                          {project.location && (
                            <div className="flex items-center text-gray-500 text-sm mb-6">
                              <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                              <span>{project.location}</span>
                            </div>
                          )}

                          {/* Barra de Progresso de Arrecadação */}
                          {showGoal && (
                            <div className="mb-6">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">{t.goalLabel}</span>
                                <span className="text-sm font-medium text-gray-900">{percent.toFixed(0)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                <div
                                  className="h-3 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: '#3b660a' }}
                                />
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {t.raisedLabel}: <span className="font-semibold text-gray-900">{formatMoney(project.raised)}</span>
                                </span>
                                <span className="text-gray-600">
                                  {t.goalShortLabel}: <span className="font-semibold text-gray-900">{formatMoney(project.goal)}</span>
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Botão de Ação */}
                          <div className="mt-auto">
                            <Button
                              asChild
                              className="w-full"
                              style={{ backgroundColor: '#e8440d' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}
                            >
                              <SmartLink to={project.donation_link || t.supportLink || '/como-ajudar'}>
                                {t.supportButton}
                              </SmartLink>
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
                      style={{ color: ['#3b660a', '#81a425', '#e8440d', '#47623d'][index % 4] }}
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
      <section className="py-16" style={{ backgroundColor: '#2b4744' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">{t.ctaTitle}</h2>
            <p className="text-xl mb-8 font-nunito opacity-90">{t.ctaText}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {t.ctaPrimaryText && (
                <Button asChild size="lg" style={{ backgroundColor: '#e8440d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}>
                  <SmartLink to={t.ctaPrimaryLink || '/doacao'}>{t.ctaPrimaryText}</SmartLink>
                </Button>
              )}
              {t.ctaSecondaryText && (
                <Button asChild size="lg" variant="outline" className="border-white" style={{ backgroundColor: 'transparent', color: 'white', borderColor: 'white' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#2b4744'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'white'; }}>
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
