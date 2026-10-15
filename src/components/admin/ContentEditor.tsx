import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, ExternalLink, Loader2, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ImageField from './ImageField';
import ThemePreview from './ThemePreview';
import { saveContent } from '@/lib/api';
import { useSiteContent } from '@/content/SiteContentContext';
import { DEFAULT_CONTENT, type PageKey } from '@/content/defaults';
import { PAGE_SCHEMAS, type Field, type ListField, type SimpleField } from '@/content/schema';

type Obj = Record<string, unknown>;

const SITE_ROUTES = [
  '/', '/quem-somos', '/projetos', '/noticias', '/como-ajudar', '/doacao', '/contato', '/transparencia', '/#newsletter',
];

const getPath = (obj: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, key) => (acc as Obj | undefined)?.[key], obj);

function setPath<T>(obj: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split('.');
  const current = (obj ?? {}) as Obj;
  return {
    ...current,
    [head]: rest.length ? setPath(current[head], rest.join('.'), value) : value,
  } as T;
}

const emptyItem = (fields: SimpleField[]) => Object.fromEntries(fields.map((f) => [f.key, '']));

// ==================== CAMPOS ====================

const SimpleInput = ({ field, value, onChange, id }: {
  field: SimpleField;
  value: string;
  onChange: (v: string) => void;
  id: string;
}) => {
  if (field.type === 'color') {
    const valid = /^#[0-9a-f]{6}$/i.test(value);
    return (
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={field.label}
          value={valid ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded border bg-white p-1"
        />
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-32 font-mono" maxLength={7} />
        {!valid && value && <span className="text-xs text-red-600">Use o formato #RRGGBB</span>}
      </div>
    );
  }
  if (field.type === 'image') return <ImageField id={id} value={value} onChange={onChange} crop={field.crop} />;
  if (field.type === 'textarea') {
    return <Textarea id={id} rows={field.rows ?? 3} value={value} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      list={field.type === 'link' ? 'site-routes' : undefined}
      placeholder={field.type === 'link' ? '/doacao ou https://...' : undefined}
    />
  );
};

const FieldRow = ({ field, value, onChange, id }: {
  field: SimpleField;
  value: unknown;
  onChange: (v: string) => void;
  id: string;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{field.label}</Label>
    <SimpleInput field={field} value={typeof value === 'string' ? value : ''} onChange={onChange} id={id} />
    {field.help && <p className="text-xs text-gray-500">{field.help}</p>}
  </div>
);

const ListEditor = ({ field, value, onChange, idPrefix }: {
  field: ListField;
  value: unknown;
  onChange: (v: Obj[]) => void;
  idPrefix: string;
}) => {
  const items = Array.isArray(value) ? (value as Obj[]) : [];
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (index: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setOpen((prev) => {
      const s = new Set<number>();
      prev.forEach((i) => s.add(i === index ? target : i === target ? index : i));
      return s;
    });
  };

  const remove = (index: number) => {
    const title = String(items[index]?.[field.titleKey ?? ''] || `${field.itemLabel} ${index + 1}`);
    if (!confirm(`Remover "${title}"?`)) return;
    onChange(items.filter((_, i) => i !== index));
    setOpen((prev) => {
      const s = new Set<number>();
      prev.forEach((i) => { if (i !== index) s.add(i > index ? i - 1 : i); });
      return s;
    });
  };

  const add = () => {
    onChange([...items, emptyItem(field.fields)]);
    setOpen((prev) => new Set(prev).add(items.length));
  };

  return (
    <div className="space-y-2">
      <div>
        <Label>{field.label}</Label>
        {field.help && <p className="text-xs text-gray-500 mt-1">{field.help}</p>}
      </div>

      {items.length === 0 && (
        <p className="text-sm text-gray-500 border border-dashed rounded-md p-4 text-center">
          Nenhum item. Clique em "Adicionar" abaixo.
        </p>
      )}

      {items.map((item, index) => {
        const isOpen = open.has(index);
        const image = field.fields.find((f) => f.type === 'image');
        const thumb = image ? String(item[image.key] || '') : '';
        const title = String(item[field.titleKey ?? ''] || '').trim() || `${field.itemLabel} ${index + 1}`;
        return (
          <div key={index} className="border rounded-md bg-white">
            <div className="flex items-center gap-2 p-2">
              <button
                type="button"
                onClick={() => toggle(index)}
                className="flex items-center gap-2 flex-1 min-w-0 text-left px-1 py-1 rounded hover:bg-gray-50"
              >
                {isOpen ? <ChevronDown className="h-4 w-4 flex-shrink-0" /> : <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                {thumb && <img src={thumb} alt="" className="h-8 w-8 rounded object-cover flex-shrink-0" />}
                <span className="truncate text-sm font-medium">{title}</span>
              </button>
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => move(index, -1)} disabled={index === 0} title="Mover para cima" aria-label="Mover para cima">
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => move(index, 1)} disabled={index === items.length - 1} title="Mover para baixo" aria-label="Mover para baixo">
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={() => remove(index)} title="Remover" aria-label="Remover">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {isOpen && (
              <div className="border-t p-4 space-y-4">
                {field.fields.map((sub) => (
                  <FieldRow
                    key={sub.key}
                    field={sub}
                    id={`${idPrefix}-${index}-${sub.key}`}
                    value={item[sub.key]}
                    onChange={(v) => onChange(items.map((it, i) => (i === index ? { ...it, [sub.key]: v } : it)))}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4 mr-1" />
        Adicionar {field.itemLabel.toLowerCase()}
      </Button>
    </div>
  );
};

const FieldEditor = ({ field, page, onChange, pageKey }: {
  field: Field;
  page: Obj;
  onChange: (path: string, value: unknown) => void;
  pageKey: string;
}) => {
  const id = `${pageKey}-${field.key}`;
  const value = getPath(page, field.key);
  if (field.type === 'list') {
    return <ListEditor field={field} value={value} onChange={(v) => onChange(field.key, v)} idPrefix={id} />;
  }
  return <FieldRow field={field} id={id} value={value} onChange={(v) => onChange(field.key, v)} />;
};

// ==================== EDITOR ====================

const ContentEditor = () => {
  const { raw, reload, age } = useSiteContent();
  const [pageKey, setPageKey] = useState<PageKey>('home');
  const [drafts, setDrafts] = useState<Partial<Record<PageKey, Obj>>>({});
  const [isSaving, setIsSaving] = useState(false);

  const schema = PAGE_SCHEMAS.find((p) => p.key === pageKey)!;
  const page = (drafts[pageKey] ?? raw[pageKey]) as Obj;

  const dirtyPages = useMemo(
    () =>
      new Set(
        (Object.keys(drafts) as PageKey[]).filter(
          (key) => JSON.stringify(drafts[key]) !== JSON.stringify(raw[key]),
        ),
      ),
    [drafts, raw],
  );
  const isDirty = dirtyPages.has(pageKey);

  // Avisa antes de fechar a aba com alterações não salvas
  useEffect(() => {
    if (!dirtyPages.size) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirtyPages.size]);

  const update = (path: string, value: unknown) => {
    setDrafts((prev) => ({ ...prev, [pageKey]: setPath((prev[pageKey] ?? raw[pageKey]) as Obj, path, value) }));
  };

  const discard = () => {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[pageKey];
      return next;
    });
  };

  const restoreDefaults = () => {
    if (!confirm(`Restaurar os textos e imagens originais da página "${schema.label}"? As alterações só valem depois de salvar.`)) return;
    setDrafts((prev) => ({ ...prev, [pageKey]: structuredClone(DEFAULT_CONTENT[pageKey]) as Obj }));
  };

  const save = async () => {
    setIsSaving(true);
    try {
      await saveContent(pageKey, page);
      await reload();
      discard();
      toast.success(`Página "${schema.label}" salva! As mudanças já estão no site.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
      <datalist id="site-routes">
        {SITE_ROUTES.map((r) => <option key={r} value={r} />)}
      </datalist>

      {/* Lista de páginas */}
      <nav className="hidden lg:block">
        <ul className="space-y-1 sticky top-4">
          {PAGE_SCHEMAS.map((p) => (
            <li key={p.key}>
              <button
                type="button"
                onClick={() => setPageKey(p.key)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                  p.key === pageKey ? 'text-white font-medium' : 'hover:bg-gray-100 text-gray-700'
                }`}
                style={p.key === pageKey ? { backgroundColor: '#3b660a' } : {}}
              >
                {p.label}
                {dirtyPages.has(p.key) && (
                  <span className="h-2 w-2 rounded-full bg-orange-500" title="Alterações não salvas" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="lg:hidden">
        <Select value={pageKey} onValueChange={(v) => setPageKey(v as PageKey)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SCHEMAS.map((p) => (
              <SelectItem key={p.key} value={p.key}>
                {p.label}{dirtyPages.has(p.key) ? ' •' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 min-w-0">
        {/* Barra de ações */}
        <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur py-3 border-b flex flex-wrap items-center gap-3 justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-bold font-montserrat" style={{ color: '#3b660a' }}>{schema.label}</h2>
            <p className="text-sm text-gray-600">{schema.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {schema.path && (
              <Button asChild variant="outline" size="sm">
                <a href={schema.path} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Ver página
                </a>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={restoreDefaults} title="Voltar aos textos originais">
              <RotateCcw className="h-4 w-4 mr-1" />
              Restaurar padrão
            </Button>
            {isDirty && (
              <Button variant="outline" size="sm" onClick={discard} disabled={isSaving}>
                Descartar
              </Button>
            )}
            <Button size="sm" onClick={save} disabled={!isDirty || isSaving} style={{ backgroundColor: '#3b660a' }}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
              Salvar alterações
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Dica: em qualquer texto, escreva <code className="bg-gray-200 px-1 rounded">{'{anos}'}</code> para mostrar a
          idade da Missão (hoje: {age} anos — muda sozinho todo 28 de agosto) e{' '}
          <code className="bg-gray-200 px-1 rounded">{'{ano}'}</code> para o ano atual.
        </p>

        <div className={pageKey === 'theme' ? 'grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px] items-start' : ''}>
          <div className="space-y-4 min-w-0">
            {schema.sections.map((section) => (
              <Card key={`${pageKey}-${section.title}`}>
                <CardHeader>
                  <CardTitle className="text-lg font-montserrat">{section.title}</CardTitle>
                  {section.description && <CardDescription>{section.description}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.fields.map((field) => (
                    <FieldEditor key={field.key} field={field} page={page} onChange={update} pageKey={pageKey} />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {pageKey === 'theme' && (
            <aside className="order-first xl:order-none xl:sticky xl:top-28">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-montserrat">Prévia</CardTitle>
                  <CardDescription>Mostra as cores enquanto você edita. Elas só vão para o site ao salvar.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemePreview theme={page as Record<string, string>} />
                </CardContent>
              </Card>
            </aside>
          )}
        </div>

        {isDirty && (
          <div className="flex justify-end">
            <Button onClick={save} disabled={isSaving} style={{ backgroundColor: '#3b660a' }}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
              Salvar alterações
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;
