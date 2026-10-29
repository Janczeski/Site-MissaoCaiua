import { useContent } from '@/content/SiteContentContext';
import type { CampaignItem } from '@/lib/api';
import { formatBRL } from './DonationLayout';

// Destaques do quadro da campanha, a partir dos dados da Transforme.tech:
// valor sugerido (quando é um só) e, se a campanha exibir, arrecadado, doadores e meta
const CampaignHighlights = ({ campaign }: { campaign: CampaignItem }) => {
  const t = useContent('donation');
  const values = campaign.values ?? [];
  const monthlyOnly = campaign.monthly && !campaign.oneTime;
  const raised = campaign.showRaised ? campaign.raised ?? 0 : 0;
  const donors = campaign.showRaised ? campaign.donors ?? 0 : 0;
  const goal = campaign.goal ?? 0;

  return (
    <>
      {values.length === 1 && (
        <div className="mt-8 rounded-xl bg-white/10 px-5 py-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-4xl font-bold font-montserrat">{formatBRL(values[0])}</span>
          {monthlyOnly && <span className="font-nunito opacity-90">{t.campaignMonthly}</span>}
        </div>
      )}

      {(raised > 0 || donors > 0) && (
        <div className="mt-8 rounded-xl bg-white/10 px-5 py-4 space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-nunito">
            {raised > 0 && (
              <span>
                <strong className="text-2xl font-montserrat">{formatBRL(raised)}</strong> {t.campaignRaised}
              </span>
            )}
            {donors > 0 && (
              <span className="opacity-90">
                <strong>{donors}</strong> {t.campaignDonors}
              </span>
            )}
          </div>
          {goal > 0 && (
            <div>
              <div className="h-2.5 rounded-full bg-white/20">
                <div
                  className="h-2.5 rounded-full"
                  style={{ width: `${Math.min(100, (raised / goal) * 100)}%`, backgroundColor: 'var(--c-secondary)' }}
                />
              </div>
              <p className="text-sm font-nunito opacity-80 mt-1.5">
                {t.campaignGoal}: {formatBRL(goal)}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CampaignHighlights;
