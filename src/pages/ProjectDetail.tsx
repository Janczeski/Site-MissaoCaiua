import { useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SmartLink from '@/components/SmartLink';
import { AboutCard, CampaignPanel, DonationGrid, formatBRL } from '@/components/donation/DonationLayout';
import { useContent } from '@/content/SiteContentContext';
import { usePublicProject } from '@/hooks/use-public-data';
import NotFound from './NotFound';

// Página de um projeto: quadro com título, local, meta e botão de apoio; descrição completa ao lado
const ProjectDetail = () => {
  const { id = '' } = useParams();
  const t = useContent('projects');
  const { data: project, isLoading, isError } = usePublicProject(id);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--c-primary)' }} />
      </div>
    );
  }
  if (isError || !project) return <NotFound />;

  const showGoal = project.show_goal && project.goal > 0;
  const percent = showGoal ? (project.raised / project.goal) * 100 : 0;

  return (
    <div className="min-h-screen">
      {project.image ? (
        <section className="bg-gray-50 pt-8 md:pt-10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <img
                src={project.image}
                alt={project.title}
                className="w-full aspect-[2/1] max-h-[520px] object-cover rounded-2xl shadow-md"
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="relative py-20 site-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold font-montserrat">{project.title}</h1>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <DonationGrid withPanel>
            <CampaignPanel className="lg:col-span-2 lg:sticky lg:top-28" label={project.category} title={project.title}>
              {project.location && (
                <p className="flex items-center gap-2 font-nunito opacity-90">
                  <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--c-secondary)' }} />
                  {project.location}
                </p>
              )}

              {showGoal && (
                <div className="mt-8 rounded-xl bg-white/10 px-5 py-4 space-y-2">
                  <div className="flex justify-between text-sm font-nunito">
                    <span className="font-semibold">{t.goalLabel}</span>
                    <span className="font-semibold">{percent.toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/20">
                    <div
                      className="h-2.5 rounded-full"
                      style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: 'var(--c-secondary)' }}
                    />
                  </div>
                  <div className="flex justify-between text-sm font-nunito opacity-90">
                    <span>{t.raisedLabel}: <strong>{formatBRL(project.raised)}</strong></span>
                    <span>{t.goalShortLabel}: <strong>{formatBRL(project.goal)}</strong></span>
                  </div>
                </div>
              )}

              <Button
                asChild
                size="lg"
                className="w-full mt-8"
                style={{ backgroundColor: 'var(--c-accent)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent)'}
              >
                <SmartLink to={project.donation_link || t.supportLink || '/como-ajudar'}>{t.supportButton}</SmartLink>
              </Button>
            </CampaignPanel>

            {project.description && (
              <AboutCard className="lg:col-span-3" title={t.detailAboutTitle} text={project.description} />
            )}
          </DonationGrid>

          <div className="max-w-6xl mx-auto mt-10">
            <Button asChild variant="ghost" style={{ color: 'var(--c-primary)' }}>
              <SmartLink to="/projetos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.detailBack}
              </SmartLink>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
