import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EmbedHtml from '@/components/EmbedHtml';
import SmartLink from '@/components/SmartLink';
import { useContent } from '@/content/SiteContentContext';
import { usePublicProjects } from '@/hooks/use-public-data';
import { Heart, Shield, CheckCircle, ExternalLink, Clock } from 'lucide-react';

const usageColors = ['var(--c-primary)', 'var(--c-secondary)', 'var(--c-accent)', 'var(--c-tertiary)'];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const Donation = () => {
  const t = useContent('donation');
  const { data: projects = [] } = usePublicProjects();
  const widgetCode = t.widgetCode.trim();
  const hotsiteUrl = t.hotsiteUrl.trim();
  // Só projetos com link de doação próprio (ex.: campanha específica na Transforme.tech)
  const donationProjects = projects.filter((p) => p.donation_link.trim());

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 site-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">{t.heroTitle}</h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90 mb-8">{t.heroSubtitle}</p>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-lg">
              {t.badge1 && (
                <div className="flex items-center">
                  <Shield className="h-6 w-6 mr-2" />
                  <span>{t.badge1}</span>
                </div>
              )}
              {t.badge2 && (
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  <span>{t.badge2}</span>
                </div>
              )}
              {t.badge3 && (
                <div className="flex items-center">
                  <Heart className="h-6 w-6 mr-2" />
                  <span>{t.badge3}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Doação (widget da Transforme.tech, link do hotsite ou aviso) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-10">
            {widgetCode ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3 font-montserrat">{t.widgetTitle}</h2>
                  {t.widgetText && <p className="text-gray-600 font-nunito">{t.widgetText}</p>}
                </div>
                <EmbedHtml
                  html={widgetCode}
                  className="donation-widget w-full overflow-hidden [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:border-0"
                />
                {hotsiteUrl && (
                  <p className="text-center text-sm text-gray-500 mt-6">
                    <a href={hotsiteUrl} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">
                      {t.hotsiteButton}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </p>
                )}
              </>
            ) : hotsiteUrl ? (
              <div className="text-center">
                <Heart className="h-14 w-14 mx-auto mb-4" style={{ color: 'var(--c-accent)' }} />
                <h2 className="text-3xl font-bold text-gray-900 mb-3 font-montserrat">{t.widgetTitle}</h2>
                {t.widgetText && <p className="text-gray-600 font-nunito mb-8 max-w-2xl mx-auto">{t.widgetText}</p>}
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 py-6"
                  style={{ backgroundColor: 'var(--c-accent)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent)'}
                >
                  <a href={hotsiteUrl} target="_blank" rel="noopener noreferrer">
                    {t.hotsiteButton}
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Clock className="h-14 w-14 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold text-gray-900 mb-3 font-montserrat">{t.pendingTitle}</h2>
                <p className="text-gray-600 font-nunito mb-8 max-w-2xl mx-auto">{t.pendingText}</p>
                {t.pendingButton && (
                  <Button asChild size="lg" style={{ backgroundColor: 'var(--c-primary)' }}>
                    <SmartLink to={t.pendingLink || '/contato'}>{t.pendingButton}</SmartLink>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projetos com link de doação próprio */}
      {donationProjects.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-3 font-montserrat">{t.projectsTitle}</h2>
                {t.projectsText && <p className="text-gray-600 font-nunito">{t.projectsText}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {donationProjects.map((project) => {
                  const showGoal = project.show_goal && project.goal > 0;
                  const percent = showGoal ? (project.raised / project.goal) * 100 : 0;
                  return (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow flex flex-col">
                      <CardHeader>
                        <CardTitle className="flex items-center font-montserrat">
                          <Heart className="h-8 w-8 flex-shrink-0" style={{ color: 'var(--c-primary)' }} />
                          <span className="ml-3">{project.title}</span>
                        </CardTitle>
                        <CardDescription className="font-nunito line-clamp-3">{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto space-y-4">
                        {showGoal && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>{t.projectRaised}: {formatCurrency(project.raised)}</span>
                              <span>{t.projectGoal}: {formatCurrency(project.goal)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="h-3 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: 'var(--c-primary)' }}
                              />
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {Math.round(percent)}% {t.projectReached}
                            </p>
                          </div>
                        )}
                        <Button asChild className="w-full" variant="outline">
                          <SmartLink to={project.donation_link}>{t.projectButton}</SmartLink>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Como usamos sua doação */}
      {t.usage.length > 0 && (
        <section className={`py-16 ${donationProjects.length > 0 ? 'bg-gray-50' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-montserrat">{t.usageTitle}</h2>
              <div className="space-y-5">
                {t.usage.map((item, index) => {
                  const percent = Math.max(0, Math.min(100, parseFloat(item.percent) || 0));
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-nunito text-gray-700">{item.label}</span>
                        <span className="font-semibold text-gray-900">{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full"
                          style={{ width: `${percent}%`, backgroundColor: usageColors[index % usageColors.length] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Donation;
