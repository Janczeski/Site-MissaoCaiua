import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getContent } from '@/lib/api';
import { DEFAULT_CONTENT, type SiteContent } from './defaults';

// Fundação: 28 de agosto de 1928 (Dourados - MS)
const FOUNDING = { year: 1928, month: 8, day: 28 };
const TIMEZONE = 'America/Campo_Grande';

declare global {
  interface Window {
    __SITE_CONTENT__?: Record<string, unknown>;
  }
}

function todayInDourados() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

export function missionAge() {
  const today = todayInDourados();
  const hadBirthday =
    today.month > FOUNDING.month || (today.month === FOUNDING.month && today.day >= FOUNDING.day);
  return { age: today.year - FOUNDING.year - (hadBirthday ? 0 : 1), year: today.year };
}

// Recalcula a cada minuto; só muda de valor no aniversário da Missão (e na virada do ano)
function useMissionAge() {
  const [value, setValue] = useState(missionAge);
  useEffect(() => {
    const timer = setInterval(() => {
      const next = missionAge();
      setValue((prev) => (prev.age === next.age && prev.year === next.year ? prev : next));
    }, 60_000);
    return () => clearInterval(timer);
  }, []);
  return value;
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

// Mescla o que veio do banco sobre os padrões. Listas são substituídas inteiras.
export function mergeContent<T>(defaults: T, stored: unknown): T {
  if (Array.isArray(defaults)) return (Array.isArray(stored) ? stored : defaults) as T;
  if (isPlainObject(defaults)) {
    const source = isPlainObject(stored) ? stored : {};
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(defaults)) {
      out[key] = mergeContent((defaults as Record<string, unknown>)[key], source[key]);
    }
    return out as T;
  }
  if (typeof defaults === 'string') return (typeof stored === 'string' ? stored : defaults) as T;
  return (stored ?? defaults) as T;
}

function replaceTokens<T>(value: T, tokens: Record<string, string>): T {
  if (typeof value === 'string') {
    return value.replace(/\{(\w+)\}/g, (match, name) => tokens[name] ?? match) as T;
  }
  if (Array.isArray(value)) return value.map((v) => replaceTokens(v, tokens)) as T;
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replaceTokens(v, tokens)])) as T;
  }
  return value;
}

interface SiteContentContextValue {
  content: SiteContent;
  raw: SiteContent;
  loaded: boolean;
  age: number;
  reload: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextValue | undefined>(undefined);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const injected = typeof window !== 'undefined' ? window.__SITE_CONTENT__ : undefined;
  const [stored, setStored] = useState<unknown>(injected);
  const [loaded, setLoaded] = useState(Boolean(injected));
  const { age, year } = useMissionAge();

  const reload = useCallback(async () => {
    try {
      setStored(await getContent());
    } catch (error) {
      console.error('Erro ao carregar conteúdo do site:', error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!injected) reload();
  }, [injected, reload]);

  const raw = useMemo(() => mergeContent(DEFAULT_CONTENT, stored), [stored]);
  const content = useMemo(
    () => replaceTokens(raw, { anos: String(age), ano: String(year) }),
    [raw, age, year],
  );

  return (
    <SiteContentContext.Provider value={{ content, raw, loaded, age, reload }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error('useSiteContent must be used within SiteContentProvider');
  return context;
}

export function useContent<K extends keyof SiteContent>(page: K): SiteContent[K] {
  return useSiteContent().content[page];
}

// Quebra um texto em parágrafos (linha em branco separa parágrafos)
export const paragraphs = (text: string) =>
  text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

// Quebra um texto em linhas não vazias
export const lines = (text: string) =>
  text.split('\n').map((l) => l.trim()).filter(Boolean);
