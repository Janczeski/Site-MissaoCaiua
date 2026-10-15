// Converte as cores editáveis (aba Páginas → Cores) em variáveis CSS aplicadas ao site.
// Os componentes usam var(--c-...) e as classes cinza do Tailwind são remapeadas dentro do escopo.
import { DEFAULT_CONTENT } from './defaults';

export type Theme = typeof DEFAULT_CONTENT.theme;

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

const normalizeHex = (value: string, fallback: string) => {
  const v = value.trim();
  if (!HEX.test(v)) return fallback;
  return v.length === 4 ? `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}` : v.toLowerCase();
};

// "#3b660a" → "88 82% 22%" (formato usado pelas variáveis do shadcn/ui)
function hexToHslTriplet(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return `${h.toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
}

const VARS: Record<keyof Theme, string> = {
  primary: '--c-primary',
  primaryHover: '--c-primary-hover',
  accent: '--c-accent',
  accentHover: '--c-accent-hover',
  secondary: '--c-secondary',
  tertiary: '--c-tertiary',
  buttonText: '--c-button-text',
  headerBg: '--c-header-bg',
  headerText: '--c-header-text',
  heroBg: '--c-hero-bg',
  heroText: '--c-hero-text',
  pageBg: '--c-page-bg',
  sectionAltBg: '--c-section-alt',
  cardBg: '--c-card-bg',
  headingText: '--c-heading',
  bodyText: '--c-body',
  mutedText: '--c-muted',
  ctaBg: '--c-cta-bg',
  ctaText: '--c-cta-text',
  footerBg: '--c-footer-bg',
  footerHeading: '--c-footer-heading',
  footerText: '--c-footer-text',
};

export function buildThemeCss(theme: Partial<Theme>, scope: string) {
  const defaults = DEFAULT_CONTENT.theme;
  const c = Object.fromEntries(
    (Object.keys(defaults) as (keyof Theme)[]).map((k) => [k, normalizeHex(theme[k] ?? '', defaults[k])]),
  ) as Theme;
  const s = scope;

  return `
${s} {
${(Object.keys(VARS) as (keyof Theme)[]).map((k) => `  ${VARS[k]}: ${c[k]};`).join('\n')}
  --primary: ${hexToHslTriplet(c.primary)};
  --primary-foreground: ${hexToHslTriplet(c.buttonText)};
  --ring: ${hexToHslTriplet(c.primary)};
  --background: ${hexToHslTriplet(c.pageBg)};
  --card: ${hexToHslTriplet(c.cardBg)};
  --card-foreground: ${hexToHslTriplet(c.headingText)};
  --foreground: ${hexToHslTriplet(c.headingText)};
  --muted-foreground: ${hexToHslTriplet(c.mutedText)};
  background-color: var(--c-page-bg);
  color: var(--c-body);
}
${s} .text-gray-900, ${s} .text-gray-800 { color: var(--c-heading); }
${s} .text-gray-700, ${s} .text-gray-600 { color: var(--c-body); }
${s} .text-gray-500, ${s} .text-gray-400 { color: var(--c-muted); }
${s} .bg-gray-50 { background-color: var(--c-section-alt); }
${s} .bg-white:not([class*="bg-opacity"]) { background-color: var(--c-card-bg); }
${s} section.bg-white { background-color: var(--c-page-bg); }
${s} header.bg-white { background-color: var(--c-header-bg); }
${s} header .text-gray-700, ${s} header .text-gray-900 { color: var(--c-header-text); }
${s} .site-hero { background-color: var(--c-hero-bg); }
${s} .site-hero .text-white { color: var(--c-hero-text); }
${s} .site-cta { background-color: var(--c-cta-bg); }
${s} .site-cta .text-white { color: var(--c-cta-text); }
${s} .site-cta .border-white { border-color: var(--c-cta-text); }
${s} footer { background-color: var(--c-footer-bg); color: var(--c-footer-heading); }
${s} footer .text-gray-300, ${s} footer .text-gray-400 { color: var(--c-footer-text); }
${s} footer .hover\\:text-white:hover { color: var(--c-footer-heading); }
`;
}
