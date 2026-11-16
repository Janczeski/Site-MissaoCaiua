// Carregador do Pixel da Meta. Só é chamado pelo runtime (runtime.ts) depois de conferir
// configuração do servidor, consentimento e rota. Idempotente: um único script e um único init.

export const META_PIXEL_SCRIPT_SRC = 'https://connect.facebook.net/en_US/fbevents.js';
export const META_PIXEL_COOKIES = ['_fbp', '_fbc'] as const;
const OWNER_MARK = '__missaoCaiua';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fbq = ((...args: unknown[]) => void) & Record<string, any>;

export interface PixelWindow {
  fbq?: Fbq;
  _fbq?: Fbq;
}

export interface PixelDocument {
  cookie: string;
  createElement(tag: 'script'): { async: boolean; src: string };
  head: { appendChild(node: unknown): unknown } | null;
}

export interface MetaPixelController {
  readonly loaded: boolean;
  readonly active: boolean;
  /** Carrega (uma vez) e ativa o envio. false se não for possível ou se já foi encerrado. */
  start(): boolean;
  /** Registra a visita atual: envia o 1º PageView do documento; os seguintes ficam com o SDK. */
  trackPageView(): boolean;
  /** Encerra o SDK nesta página (sem apagar cookies), antes de abrir um documento novo. */
  suspend(): void;
  /** Revogação: encerra o SDK e apaga os cookies do pixel. */
  revoke(): void;
}

/** Há um fbq na página que não foi criado por este módulo (ex.: código colado no admin). */
export function hasForeignFbq(win: PixelWindow): boolean {
  return Boolean(win.fbq) && !win.fbq![OWNER_MARK];
}

/** Domínios em que os cookies do pixel podem ter sido gravados (o _fbp costuma usar o domínio-pai). */
export function cookieDomains(hostname: string): (string | null)[] {
  const host = hostname.toLowerCase();
  const domains: (string | null)[] = [null];
  if (!host || /^[\d.]+$/.test(host) || host.includes(':')) return domains;
  const labels = host.split('.');
  domains.push(host);
  for (let i = 0; i < labels.length - 1; i++) domains.push(`.${labels.slice(i).join('.')}`);
  return domains;
}

export function clearPixelCookies(doc: Pick<PixelDocument, 'cookie'>, hostname: string): void {
  for (const name of META_PIXEL_COOKIES) {
    for (const domain of cookieDomains(hostname)) {
      try {
        doc.cookie =
          `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/` + (domain ? `; Domain=${domain}` : '');
      } catch {
        /* cookies bloqueados: nada a apagar */
      }
    }
  }
}

export function createMetaPixel(options: {
  pixelId: string;
  win: PixelWindow;
  doc: PixelDocument;
  hostname: string;
  /** Chamado uma vez, logo antes de inserir o fbevents.js (instala a proteção de navegação). */
  onBeforeLoad?: () => void;
}): MetaPixelController {
  const { pixelId, win, doc, hostname, onBeforeLoad } = options;
  let loaded = Boolean(win.fbq?.[OWNER_MARK]);
  let active = false;
  // Depois de suspend/revoke o documento está sendo substituído: o SDK não volta a enviar aqui.
  let ended = false;
  let pageViewSent = false;

  const call = (...args: unknown[]) => win.fbq?.(...args);

  const end = () => {
    ended = true;
    active = false;
    const fbq = win.fbq;
    if (!loaded || !fbq?.[OWNER_MARK]) return;
    // fbevents.js ainda não executou: descarta a fila (init/PageView) para que nada seja enviado
    if (!fbq.callMethod && Array.isArray(fbq.queue)) fbq.queue.length = 0;
    call('consent', 'revoke');
  };

  return {
    get loaded() {
      return loaded;
    },
    get active() {
      return active;
    },
    start() {
      if (ended) return false;
      if (active) return true;
      // Já existe um fbq (não é nosso, ou é de um controlador anterior): não reutiliza
      // nem inicializa de novo, para não duplicar eventos nem misturar configurações.
      if (loaded || win.fbq) return false;
      if (!doc.head) return false;

      // Equivalente ao código base da Meta, sem o fallback <noscript>.
      // Mesma fila do código oficial: guarda o objeto `arguments` até o fbevents.js carregar
      const fbq = function () {
        // eslint-disable-next-line prefer-rest-params
        if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
        // eslint-disable-next-line prefer-rest-params
        else fbq.queue.push(arguments);
      } as unknown as Fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
      fbq[OWNER_MARK] = true;
      // Sem `disablePushState`: o SDK descarta todo fbq('track', 'PageView') repetido no mesmo
      // documento e só aceita os PageViews seguintes vindos do seu próprio rastreador de histórico
      // (pushState/replaceState/popstate). Ver trackPageView. A saída para rotas não liberadas é
      // interceptada antes dele pelo navigationGuard.ts.
      win.fbq = fbq;
      if (!win._fbq) win._fbq = fbq;

      // Configuração automática desativada (deve vir antes do init, conforme a Meta)
      fbq('set', 'autoConfig', false, pixelId);
      // init sem terceiro argumento: nenhuma correspondência avançada manual
      fbq('init', pixelId);

      onBeforeLoad?.();
      const script = doc.createElement('script');
      script.async = true;
      script.src = META_PIXEL_SCRIPT_SRC;
      doc.head.appendChild(script);

      loaded = true;
      active = true;
      return true;
    },
    trackPageView() {
      if (!active) return false;
      // Só o primeiro PageView do documento sai daqui; nas navegações internas seguintes quem
      // envia é o rastreador de histórico do SDK (uma chamada manual seria descartada pelo SDK).
      if (!pageViewSent) {
        call('track', 'PageView');
        pageViewSent = true;
      }
      return true;
    },
    suspend: end,
    revoke() {
      end();
      // Com fbq de terceiros os cookies são dele: não mexemos (este consentimento não o controla)
      if (!hasForeignFbq(win)) clearPixelCookies(doc, hostname);
    },
  };
}
