import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BannerCarousel from '@/components/BannerCarousel';
import SmartLink from '@/components/SmartLink';
import { AboutCard, CampaignPanel, DonationFormCard, DonationGrid } from '@/components/donation/DonationLayout';
import CampaignHighlights from '@/components/donation/CampaignHighlights';
import { useContent } from '@/content/SiteContentContext';
import { usePublicCampaign } from '@/hooks/use-public-data';
import NotFound from './NotFound';

// Página de uma campanha da Transforme.tech: tudo (banners, textos, valores) vem de lá
const Campaign = () => {
  const { uuid = '' } = useParams();
  const t = useContent('donation');
  const { data: campaign, isLoading, isError } = usePublicCampaign(uuid);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--c-primary)' }} />
      </div>
    );
  }
  if (isError || !campaign?.title) return <NotFound />;

  const slides = campaign.slides ?? [];
  // Texto do quadro: resumo da campanha (o negrito do formato do RichText não se aplica ali)
  const summary = (campaign.summary || campaign.tagline || '').replace(/\*\*/g, '');
  const description = campaign.description && campaign.description !== campaign.summary ? campaign.description : '';

  return (
    <div className="min-h-screen">
      {slides.length > 0 ? (
        <section className="bg-gray-50 pt-8 md:pt-10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <BannerCarousel slides={slides} alt={campaign.title} />
            </div>
          </div>
        </section>
      ) : (
        <section
          className="relative py-20 site-hero bg-cover bg-center"
          style={campaign.background ? { backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${campaign.background})` } : undefined}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">{campaign.title}</h1>
              {campaign.tagline && <p className="text-xl md:text-2xl font-nunito opacity-90">{campaign.tagline}</p>}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* No computador: quadro e "sobre" à esquerda, formulário à direita.
              No celular: quadro, formulário e depois o "sobre" (a doação não fica lá embaixo). */}
          <DonationGrid withPanel>
            <CampaignPanel className="lg:col-span-2" label={t.campaignLabel} title={campaign.title} text={summary}>
              <CampaignHighlights campaign={campaign} />
            </CampaignPanel>

            {campaign.open !== false ? (
              <DonationFormCard
                className="lg:col-span-3 lg:row-span-2"
                title={t.widgetTitle}
                text={t.widgetText}
                widget={{ uuid: campaign.uuid, src: `${campaign.origin}/widget-embed.js` }}
                secureNote={t.secureNote}
                linkUrl={campaign.url}
                linkText={t.hotsiteButton}
              />
            ) : (
              <div className="lg:col-span-3 lg:row-span-2 bg-white rounded-2xl shadow-md p-8 md:p-10 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 font-montserrat">{t.campaignClosedTitle}</h2>
                <p className="text-gray-600 font-nunito mb-8">{t.campaignClosedText}</p>
                <Button asChild size="lg" style={{ backgroundColor: 'var(--c-primary)' }}>
                  <SmartLink to="/doacao">{t.campaignBackButton}</SmartLink>
                </Button>
              </div>
            )}

            {description && <AboutCard className="lg:col-span-2" title={t.campaignAboutTitle} text={description} />}
          </DonationGrid>
        </div>
      </section>
    </div>
  );
};

export default Campaign;
