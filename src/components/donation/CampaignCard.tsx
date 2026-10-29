import { ArrowRight } from 'lucide-react';
import SmartLink from '@/components/SmartLink';
import { useContent } from '@/content/SiteContentContext';
import type { CampaignItem } from '@/lib/api';
import { formatBRL } from './DonationLayout';

// Cartão de campanha da Transforme.tech (página Doação e página Projetos): leva à página da campanha
const CampaignCard = ({ campaign }: { campaign: CampaignItem }) => {
  const t = useContent('donation');
  const image = campaign.slides?.[0]?.desktop || campaign.background;
  const minValue = campaign.values?.[0];

  return (
    <SmartLink
      to={`/campanhas/${campaign.uuid}`}
      className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col border border-gray-100"
    >
      {image ? (
        <img src={image} alt={campaign.title} loading="lazy" className="w-full aspect-[16/5] object-cover" />
      ) : (
        <div className="w-full aspect-[16/5] site-hero" />
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-montserrat">{campaign.title}</h3>
        {campaign.summary && (
          <p className="text-gray-600 font-nunito line-clamp-3 mb-5">{campaign.summary.replace(/\*\*/g, '')}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          {minValue ? (
            <span className="text-sm text-gray-500 font-nunito">
              {t.campaignFromLabel} <strong className="text-gray-900">{formatBRL(minValue)}</strong>
            </span>
          ) : <span />}
          <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: 'var(--c-primary)' }}>
            {t.campaignsButton}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </SmartLink>
  );
};

export default CampaignCard;
