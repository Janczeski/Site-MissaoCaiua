import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONSENT_STORAGE_KEY, CONSENT_VERSION, createConsentStore, parseConsent } from '../src/lib/tracking/consent.ts';
import { fakeStorage } from './helpers.ts';

test('sem escolha: unknown', () => {
  assert.equal(createConsentStore(() => fakeStorage()).get(), 'unknown');
});

test('recusa é gravada com versão e data', () => {
  const storage = fakeStorage();
  const store = createConsentStore(() => storage, () => new Date('2026-11-16T12:00:00Z'));
  assert.deepEqual(store.set(false), { persisted: true });
  assert.equal(store.get(), 'denied');
  assert.deepEqual(JSON.parse(storage.map.get(CONSENT_STORAGE_KEY)!), {
    version: CONSENT_VERSION,
    marketing: false,
    date: '2026-11-16T12:00:00.000Z',
  });
  // Nova instância (nova página) lê a escolha
  assert.equal(createConsentStore(() => storage).get(), 'denied');
});

test('aceite gravado: granted', () => {
  const storage = fakeStorage();
  createConsentStore(() => storage).set(true);
  assert.equal(createConsentStore(() => storage).get(), 'granted');
});

test('falha de leitura: unknown, sem exceção', () => {
  assert.equal(createConsentStore(() => fakeStorage({ failGet: true })).get(), 'unknown');
  assert.equal(
    createConsentStore(() => {
      throw new Error('localStorage bloqueado');
    }).get(),
    'unknown',
  );
});

test('aceite que não pôde ser salvo: marketing recusado nesta página', () => {
  for (const getStorage of [() => fakeStorage({ failSet: true }), () => null]) {
    const store = createConsentStore(getStorage);
    assert.deepEqual(store.set(true), { persisted: false });
    assert.equal(store.get(), 'denied');
  }
});

test('registro inválido ou de versão antiga é ignorado', () => {
  assert.equal(parseConsent('{nao-json'), null);
  assert.equal(parseConsent(JSON.stringify({ version: CONSENT_VERSION - 1, marketing: true, date: new Date().toISOString() })), null);
  assert.equal(parseConsent(JSON.stringify({ version: CONSENT_VERSION, marketing: 'sim', date: new Date().toISOString() })), null);
  assert.equal(parseConsent(JSON.stringify({ version: CONSENT_VERSION, marketing: true, date: 'ontem' })), null);
});

test('mudança em outra aba notifica; chave não relacionada é ignorada', () => {
  const storage = fakeStorage();
  const tabA = createConsentStore(() => storage);
  const tabB = createConsentStore(() => storage);
  const seen: string[] = [];
  tabA.subscribe((value) => seen.push(value));
  assert.equal(tabA.get(), 'unknown');

  tabB.set(true);
  tabA.handleStorageEvent('outra-chave');
  assert.deepEqual(seen, []);
  tabA.handleStorageEvent(CONSENT_STORAGE_KEY);
  assert.deepEqual(seen, ['granted']);

  tabB.set(false);
  tabA.handleStorageEvent(CONSENT_STORAGE_KEY);
  storage.map.clear();
  tabA.handleStorageEvent(null); // localStorage.clear()
  assert.deepEqual(seen, ['granted', 'denied', 'unknown']);
});

test('revalidate só rebaixa: aceite apagado deixa de valer; recusa local não vira aceite', () => {
  const storage = fakeStorage();
  const store = createConsentStore(() => storage);
  store.set(true);
  storage.map.clear();
  store.revalidate();
  assert.equal(store.get(), 'unknown');

  // Recusa que não pôde ser salva por cima de um aceite antigo: continua recusado
  const old = fakeStorage();
  createConsentStore(() => old).set(true);
  const failing = { ...old, setItem: () => { throw new Error('QuotaExceededError'); } };
  const tab = createConsentStore(() => failing);
  assert.equal(tab.get(), 'granted');
  assert.deepEqual(tab.set(false), { persisted: false });
  tab.revalidate();
  assert.equal(tab.get(), 'denied');
});
