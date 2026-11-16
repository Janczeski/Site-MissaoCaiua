// Consentimento de marketing (única categoria opcional do site).
// Módulo sem dependências de React/DOM para poder ser testado no Node.

export const CONSENT_STORAGE_KEY = 'missaocaiua:consent';
/** Aumente quando o texto do banner ou as finalidades mudarem: escolhas antigas deixam de valer. */
export const CONSENT_VERSION = 1;

export type MarketingConsent = 'granted' | 'denied' | 'unknown';

export interface ConsentRecord {
  version: number;
  marketing: boolean;
  /** ISO 8601 */
  date: string;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface ConsentStore {
  get(): MarketingConsent;
  record(): ConsentRecord | null;
  /** Grava a escolha. `persisted: false` quando o navegador não deixou salvar. */
  set(marketing: boolean): { persisted: boolean };
  subscribe(listener: (consent: MarketingConsent) => void): () => void;
  /** Evento `storage` vindo de outra aba. */
  handleStorageEvent(key: string | null): void;
  /**
   * Relê o armazenamento sem evento `storage` (ex.: dados do site apagados nas configurações do
   * navegador). Só rebaixa: se o aceite não está mais gravado (ou não dá para ler), deixa de valer.
   */
  revalidate(): void;
}

export function parseConsent(raw: string | null): ConsentRecord | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ConsentRecord> | null;
    if (
      !value ||
      value.version !== CONSENT_VERSION ||
      typeof value.marketing !== 'boolean' ||
      typeof value.date !== 'string' ||
      Number.isNaN(Date.parse(value.date))
    ) {
      return null;
    }
    return { version: value.version, marketing: value.marketing, date: value.date };
  } catch {
    return null;
  }
}

const toConsent = (record: ConsentRecord | null): MarketingConsent =>
  record ? (record.marketing ? 'granted' : 'denied') : 'unknown';

/**
 * Qualquer falha de leitura/gravação resulta em marketing NÃO autorizado:
 * - sem leitura → 'unknown' (o banner aparece, nada é carregado);
 * - aceite que não pôde ser salvo → 'denied' só nesta página (nada é carregado).
 */
export function createConsentStore(
  getStorage: () => StorageLike | null,
  now: () => Date = () => new Date(),
): ConsentStore {
  let current: ConsentRecord | null = null;
  let loaded = false;
  const listeners = new Set<(consent: MarketingConsent) => void>();

  const readStorage = (): ConsentRecord | null => {
    try {
      return parseConsent(getStorage()?.getItem(CONSENT_STORAGE_KEY) ?? null);
    } catch {
      return null;
    }
  };

  const ensureLoaded = () => {
    if (!loaded) {
      current = readStorage();
      loaded = true;
    }
  };

  const update = (next: ConsentRecord | null) => {
    const before = toConsent(current);
    current = next;
    loaded = true;
    const after = toConsent(current);
    if (before !== after) listeners.forEach((listener) => listener(after));
  };

  return {
    get() {
      ensureLoaded();
      return toConsent(current);
    },
    record() {
      ensureLoaded();
      return current;
    },
    set(marketing) {
      ensureLoaded();
      const record: ConsentRecord = { version: CONSENT_VERSION, marketing, date: now().toISOString() };
      const serialized = JSON.stringify(record);
      let persisted = false;
      try {
        const storage = getStorage();
        if (storage) {
          storage.setItem(CONSENT_STORAGE_KEY, serialized);
          persisted = storage.getItem(CONSENT_STORAGE_KEY) === serialized;
        }
      } catch {
        persisted = false;
      }
      // Aceite não salvo não vale: marketing fica recusado nesta página.
      update(marketing && !persisted ? { ...record, marketing: false } : record);
      return { persisted };
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    handleStorageEvent(key) {
      // key === null: o armazenamento inteiro foi limpo
      if (key !== null && key !== CONSENT_STORAGE_KEY) return;
      update(readStorage());
    },
    revalidate() {
      if (!loaded || toConsent(current) !== 'granted') return;
      const stored = readStorage();
      if (toConsent(stored) !== 'granted') update(stored);
    },
  };
}
