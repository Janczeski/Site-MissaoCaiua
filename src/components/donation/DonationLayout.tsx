import type { ReactNode } from 'react';
import { CheckCircle, ExternalLink, Lock } from 'lucide-react';
import EmbedHtml from '@/components/EmbedHtml';
import TransformeWidget from '@/components/TransformeWidget';

// Layout das páginas de doação (página Doação e páginas de campanha):
// quadro colorido da campanha à esquerda e formulário da Transforme.tech à direita

export const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: value % 1 ? 2 : 0 }).format(value);

interface CampaignPanelProps {
  label?: string;
  title: string;
  text?: string;
  amount?: string;
  amountLabel?: string;
  itemsTitle?: string;
  items?: string[];
  children?: ReactNode;
  className?: string;
}

export const CampaignPanel = ({
  label, title, text, amount, amountLabel, itemsTitle, items = [], children, className = '',
}: CampaignPanelProps) => (
  <aside
    className={`rounded-2xl shadow-md p-8 md:p-10 ${className}`}
    style={{ backgroundColor: 'var(--c-cta-bg)', color: 'var(--c-cta-text)' }}
  >
    {label && (
      <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4">
        {label}
      </span>
    )}
    <h2 className="text-3xl font-bold font-montserrat leading-tight mb-4">{title}</h2>
    {text && (
      <div className="space-y-3 font-nunito leading-relaxed opacity-90">
        {text.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
      </div>
    )}
    {amount && (
      <div className="mt-8 rounded-xl bg-white/10 px-5 py-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-4xl font-bold font-montserrat">{amount}</span>
        {amountLabel && <span className="font-nunito opacity-90">{amountLabel}</span>}
      </div>
    )}
    {items.length > 0 && (
      <div className="mt-8">
        {itemsTitle && <h3 className="font-semibold font-montserrat mb-3">{itemsTitle}</h3>}
        <ul className="space-y-3 font-nunito">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--c-secondary)' }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
    {children}
  </aside>
);

interface DonationFormCardProps {
  title: string;
  text?: string;
  /** Widget de script da Transforme.tech (só o formulário, no visual do site) */
  widget?: { uuid: string; src: string } | null;
  /** Outro código de incorporação (ex.: iframe), usado quando não há widget de script */
  html?: string;
  secureNote?: string;
  linkUrl?: string;
  linkText?: string;
  centered?: boolean;
  className?: string;
}

export const DonationFormCard = ({
  title, text, widget, html, secureNote, linkUrl, linkText, centered, className = '',
}: DonationFormCardProps) => (
  <div className={`bg-white rounded-2xl shadow-md p-6 md:p-8 ${className}`}>
    <div className={`mb-6 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-montserrat">{title}</h2>
      {text && <p className="text-gray-600 font-nunito">{text}</p>}
    </div>
    {widget ? (
      <TransformeWidget uuid={widget.uuid} src={widget.src} />
    ) : html ? (
      <EmbedHtml
        html={html}
        className="donation-widget w-full overflow-hidden [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:border-0"
      />
    ) : null}
    {(secureNote || linkUrl) && (
      <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500">
        {secureNote && (
          <span className="inline-flex items-center gap-2">
            <Lock className="h-4 w-4 flex-shrink-0" />
            {secureNote}
          </span>
        )}
        {linkUrl && (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">
            {linkText}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    )}
  </div>
);

// Grade com o quadro (opcional) e o formulário
export const DonationGrid = ({ withPanel, children }: { withPanel: boolean; children: ReactNode }) => (
  <div className={`mx-auto grid gap-6 lg:gap-8 items-start ${withPanel ? 'max-w-6xl lg:grid-cols-5' : 'max-w-3xl'}`}>
    {children}
  </div>
);
