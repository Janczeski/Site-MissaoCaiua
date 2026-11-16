import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import SmartLink from '@/components/SmartLink';
import { useContent } from '@/content/SiteContentContext';
import { cookieBannerAvailable, cookiePreferences, trackingRuntime } from '@/lib/tracking';

const { consent } = trackingRuntime;

// Só existe uma categoria opcional (marketing), então o próprio banner serve de "preferências":
// o rodapé o reabre mostrando a escolha atual.

const buttonClass =
  'flex-1 min-h-11 rounded-md border-2 px-4 py-2 text-sm font-semibold font-montserrat transition-colors ' +
  'bg-white hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-[color:var(--c-primary)]';

const CookieConsentBanner = () => {
  const footer = useContent('footer');
  const value = useSyncExternalStore(consent.subscribe, consent.get, () => 'unknown' as const);
  const [reopened, setReopened] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Quem abriu as preferências (link do rodapé) recebe o foco de volta ao fechar
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(
    () =>
      cookiePreferences.subscribe(() => {
        returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setReopened(true);
      }),
    [],
  );

  const close = () => {
    setReopened(false);
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    if (target?.isConnected) requestAnimationFrame(() => target.focus());
  };

  // Ao abrir pelo rodapé, leva o foco ao banner (leitores de tela e teclado)
  useEffect(() => {
    if (reopened) headingRef.current?.focus();
  }, [reopened]);

  const canClose = reopened && value !== 'unknown';
  useEffect(() => {
    if (!canClose) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canClose]);

  const visible = cookieBannerAvailable && (value === 'unknown' || reopened);

  // O banner é fixo no rodapé da tela: reserva o mesmo espaço no fim da página para que nada
  // (rodapé, widget de doação) fique inalcançável por baixo dele enquanto estiver aberto.
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const panel = panelRef.current;
    if (!visible || !panel) return;
    const body = document.body;
    const previous = body.style.paddingBottom;
    const apply = () => {
      body.style.paddingBottom = `${Math.ceil(window.innerHeight - panel.getBoundingClientRect().top)}px`;
    };
    apply();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(apply);
    observer?.observe(panel);
    window.addEventListener('resize', apply);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', apply);
      body.style.paddingBottom = previous;
    };
  }, [visible]);

  if (!visible) return null;

  const choose = (marketing: boolean) => {
    const { persisted } = marketing ? trackingRuntime.grant() : trackingRuntime.deny();
    close();
    if (!persisted) {
      toast.error(
        marketing
          ? 'Não foi possível salvar sua escolha neste navegador. Os cookies de marketing continuam desativados.'
          : 'Recusa aplicada nesta página, mas não foi possível salvá-la neste navegador.',
      );
    }
  };

  const record = consent.record();
  const current =
    value === 'unknown' || !record
      ? null
      : `Sua escolha atual: marketing ${value === 'granted' ? 'aceito' : 'recusado'} em ${new Date(record.date).toLocaleDateString('pt-BR')}.`;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-text"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:inset-x-auto sm:left-6 sm:bottom-6 sm:p-0 sm:max-w-md"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 sm:p-6">
        {canClose && (
          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 rounded-md p-1 text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--c-primary)]"
            aria-label="Fechar preferências de cookies"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <h2
          id="cookie-consent-title"
          ref={headingRef}
          tabIndex={-1}
          className="text-lg font-bold text-gray-900 font-montserrat mb-2 pr-6 outline-none"
        >
          Cookies de marketing
        </h2>
        <div id="cookie-consent-text" className="text-sm text-gray-600 font-nunito space-y-2">
          <p>
            Com a sua autorização, usamos o Pixel da Meta (Facebook e Instagram) para medir visitas a algumas
            páginas e o resultado das nossas campanhas de divulgação. Sem autorização, ele não é carregado e o
            site funciona normalmente.
          </p>
          <p>
            Você pode mudar sua escolha a qualquer momento em “Preferências de cookies”, no rodapé.
            {footer.privacyLink.trim() && (
              <>
                {' '}
                <SmartLink to={footer.privacyLink} className="underline" style={{ color: 'var(--c-primary)' }}>
                  {footer.privacyLabel}
                </SmartLink>
              </>
            )}
          </p>
          {current && <p className="font-semibold text-gray-700">{current}</p>}
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => choose(false)}
            className={buttonClass}
            style={{ borderColor: 'var(--c-primary)', color: 'var(--c-primary)' }}
          >
            Recusar marketing
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className={buttonClass}
            style={{ borderColor: 'var(--c-primary)', color: 'var(--c-primary)' }}
          >
            Aceitar marketing
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
