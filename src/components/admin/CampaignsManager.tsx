import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertTriangle, Edit, ExternalLink, Eye, EyeOff, Image as ImageIcon, Loader2, Plus, RefreshCw, RotateCcw, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { formatBRL } from '@/components/donation/DonationLayout';
import { campaignsApi, type CampaignData, type CampaignItem, type CampaignOverrides } from '@/lib/api';
import { IMAGE_FORMATS } from '@/lib/imageFormats';
import ImageField from './ImageField';
import RichTextEditor from './RichTextEditor';

type OverrideKey = keyof CampaignOverrides;
const EMPTY_OVERRIDES: Required<CampaignOverrides> = { title: '', tagline: '', summary: '', description: '', banner: '' };

// Rótulo de cada campo, com o aviso de "editado" e o botão para voltar ao texto da Transforme
const OverrideLabel = ({ htmlFor, label, edited, onReset }: { htmlFor: string; label: string; edited: boolean; onReset: () => void }) => (
  <div className="flex items-center justify-between gap-2">
    <Label htmlFor={htmlFor}>
      {label}
      {edited && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-normal text-amber-800">editado</span>}
    </Label>
    {edited && (
      <button type="button" onClick={onReset} className="inline-flex items-center gap-1 text-xs text-gray-600 underline">
        <RotateCcw className="h-3 w-3" />
        Usar o da Transforme
      </button>
    )}
  </div>
);

// Edição do post da campanha: o que for mudado aqui substitui o que vem da Transforme.tech
const CampaignEditDialog = ({ item, onClose, onSaved }: { item: CampaignItem | null; onClose: () => void; onSaved: () => void }) => {
  const [form, setForm] = useState(EMPTY_OVERRIDES);
  const [isSaving, setIsSaving] = useState(false);
  const source = item?.source;

  // Abre com o texto atual (editado ou da Transforme), para editar a partir dele
  useEffect(() => {
    if (!item) return;
    const o = item.overrides || {};
    setForm({
      title: o.title || source?.title || '',
      tagline: o.tagline || source?.tagline || '',
      summary: o.summary || source?.summary || '',
      description: o.description || source?.description || '',
      banner: o.banner || '',
    });
  }, [item, source]);

  const set = (key: OverrideKey, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const original = (key: OverrideKey) => (key === 'banner' ? '' : (source?.[key] ?? ''));
  // Igual ao da Transforme (ou vazio) não conta como edição: o campo continua acompanhando a Transforme
  const isEdited = (key: OverrideKey) => form[key].trim() !== '' && form[key].trim() !== original(key).trim();
  const reset = (key: OverrideKey) => set(key, original(key));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setIsSaving(true);
    const overrides: CampaignOverrides = {};
    (Object.keys(EMPTY_OVERRIDES) as OverrideKey[]).forEach((key) => {
      if (isEdited(key)) overrides[key] = form[key].trim();
    });
    try {
      await campaignsApi.setOverrides(item.id, overrides);
      toast.success('Campanha atualizada!');
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar campanha');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={Boolean(item)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar campanha</DialogTitle>
          <DialogDescription>
            O que você mudar aqui vale só para o site e tem prioridade sobre a Transforme.tech. Campos iguais aos da
            Transforme continuam se atualizando sozinhos. Valores, meta e o formulário de doação continuam vindo de lá.
          </DialogDescription>
        </DialogHeader>

        {!source ? (
          <p className="text-sm text-gray-600">A campanha ainda não foi lida da Transforme.tech. Clique em atualizar e tente de novo.</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <OverrideLabel htmlFor="campaign-title" label="Título" edited={isEdited('title')} onReset={() => reset('title')} />
              <Input id="campaign-title" value={form.title} onChange={(e) => set('title', e.target.value)} required />
            </div>

            <div className="space-y-2">
              <OverrideLabel htmlFor="campaign-tagline" label="Frase do topo" edited={isEdited('tagline')} onReset={() => reset('tagline')} />
              <Input id="campaign-tagline" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
              <p className="text-xs text-gray-500">Aparece no topo da página só quando a campanha não tem banner.</p>
            </div>

            <div className="space-y-2">
              <OverrideLabel htmlFor="campaign-summary" label="Resumo" edited={isEdited('summary')} onReset={() => reset('summary')} />
              <Textarea id="campaign-summary" rows={4} value={form.summary} onChange={(e) => set('summary', e.target.value)} />
              <p className="text-xs text-gray-500">Quadro colorido ao lado do formulário e cartões da campanha.</p>
            </div>

            <div className="space-y-2">
              <OverrideLabel
                htmlFor="campaign-description"
                label="Descrição completa"
                edited={isEdited('description')}
                onReset={() => reset('description')}
              />
              <RichTextEditor id="campaign-description" value={form.description} onChange={(v) => set('description', v)} />
              <p className="text-xs text-gray-500">Seção "Sobre a campanha".</p>
            </div>

            <div className="space-y-2">
              <OverrideLabel htmlFor="campaign-banner" label="Banner próprio (opcional)" edited={isEdited('banner')} onReset={() => reset('banner')} />
              <ImageField id="campaign-banner" value={form.banner} onChange={(url) => set('banner', url)} crop={IMAGE_FORMATS.campaignBanner} />
              <p className="text-xs text-gray-500">
                Se enviar, substitui {source.slides?.length ? 'os banners da Transforme' : 'o topo da página'} e a imagem dos cartões.
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving} style={{ backgroundColor: '#3b660a' }}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Resumo do que foi puxado da Transforme (usado na prévia e na lista)
const CampaignSummary = ({ campaign }: { campaign: Partial<CampaignData> }) => (
  <div className="space-y-3">
    {campaign.slides?.[0] ? (
      <img src={campaign.slides[0].desktop} alt="" className="w-full aspect-[16/5] object-cover rounded" />
    ) : (
      <div className="w-full aspect-[16/5] rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
        Sem banner na Transforme
      </div>
    )}
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
      {campaign.slides && campaign.slides.length > 0 && (
        <span className="inline-flex items-center gap-1">
          <ImageIcon className="h-3.5 w-3.5" />
          {campaign.slides.length} {campaign.slides.length === 1 ? 'banner' : 'banners'}
          {campaign.slides.every((s) => s.mobile) && ' (com versão para celular)'}
        </span>
      )}
      {campaign.values && campaign.values.length > 0 && (
        <span>Valores: {campaign.values.map(formatBRL).join(', ')}</span>
      )}
      <span>
        {[campaign.monthly && 'mensal', campaign.oneTime && 'única'].filter(Boolean).join(' e ') || 'frequência não informada'}
      </span>
    </div>
  </div>
);

const CampaignsManager = () => {
  const queryClient = useQueryClient();
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [code, setCode] = useState('');
  const [preview, setPreview] = useState<CampaignData | null>(null);
  const [previewError, setPreviewError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshingId, setRefreshingId] = useState<number | null>(null);
  const [editing, setEditing] = useState<CampaignItem | null>(null);

  const loadCampaigns = async () => {
    try {
      setCampaigns(await campaignsApi.list(true));
    } catch {
      toast.error('Erro ao carregar campanhas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const refreshPublic = () => queryClient.invalidateQueries({ queryKey: ['public', 'campaigns'] });

  const resetDialog = () => {
    setCode('');
    setPreview(null);
    setPreviewError('');
  };

  const handlePreview = async () => {
    setIsFetching(true);
    setPreview(null);
    setPreviewError('');
    try {
      setPreview(await campaignsApi.preview(code));
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Erro ao buscar a campanha');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await campaignsApi.create(code);
      toast.success('Campanha adicionada ao site!');
      setIsDialogOpen(false);
      resetDialog();
      await loadCampaigns();
      refreshPublic();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar campanha');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async (item: CampaignItem) => {
    setRefreshingId(item.id);
    try {
      await campaignsApi.refresh(item.id);
      toast.success('Dados atualizados da Transforme.tech!');
      refreshPublic();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar');
    } finally {
      await loadCampaigns();
      setRefreshingId(null);
    }
  };

  const handleToggleActive = async (item: CampaignItem) => {
    try {
      await campaignsApi.setActive(item.id, !item.active);
      await loadCampaigns();
      refreshPublic();
    } catch {
      toast.error('Erro ao atualizar campanha');
    }
  };

  const handleDelete = async (item: CampaignItem) => {
    if (!confirm(`Remover a campanha "${item.title || item.uuid}" do site? Ela continua existindo na Transforme.tech.`)) return;
    try {
      await campaignsApi.remove(item.id);
      await loadCampaigns();
      refreshPublic();
      toast.success('Campanha removida do site!');
    } catch {
      toast.error('Erro ao remover campanha');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold font-montserrat">Campanhas da Transforme.tech</h2>
          <p className="text-gray-600 font-nunito">
            Crie a campanha na Transforme.tech e cole aqui o código do widget: o site puxa sozinho o título, os textos,
            os banners e os valores, e monta a página da campanha no visual do site. Mudanças feitas na Transforme
            aparecem aqui em até 10 minutos.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetDialog();
        }}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#3b660a' }} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Campanha</DialogTitle>
              <DialogDescription>
                Na Transforme.tech, abra a campanha e copie o código do widget (qualquer modo) ou o link do hotsite.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-code">Código do widget ou link do hotsite</Label>
                <Textarea
                  id="campaign-code"
                  rows={6}
                  className="font-mono text-xs"
                  placeholder={'<script async src="https://missaocaiua.doe.transforme.solutions/widget-embed.js" data-transforme-uuid="..."></script>'}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setPreview(null);
                    setPreviewError('');
                  }}
                />
              </div>

              <Button type="button" variant="outline" onClick={handlePreview} disabled={!code.trim() || isFetching} className="w-full">
                {isFetching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                {isFetching ? 'Buscando na Transforme.tech (os banners podem levar alguns segundos)…' : 'Buscar campanha'}
              </Button>

              {previewError && (
                <p className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  {previewError}
                </p>
              )}

              {preview && (
                <div className="rounded-lg border p-4 space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Campanha {preview.uuid}</p>
                    <h3 className="text-lg font-bold font-montserrat">{preview.title}</h3>
                    {preview.summary && <p className="text-sm text-gray-600 line-clamp-3">{preview.summary.replace(/\*\*/g, '')}</p>}
                  </div>
                  <CampaignSummary campaign={preview} />
                  {!preview.open && (
                    <p className="text-sm text-amber-700">Esta campanha está desativada na Transforme.tech e não vai aparecer no site.</p>
                  )}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleSave} disabled={!preview || isSaving} style={{ backgroundColor: '#3b660a' }}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Adicionar ao site
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : campaigns.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center text-gray-500">
              Nenhuma campanha cadastrada. Clique em "Nova Campanha" e cole o código do widget da Transforme.tech.
            </CardContent>
          </Card>
        ) : (
          campaigns.map((item) => (
            <Card key={item.id} className={item.active && item.open !== false ? '' : 'opacity-60'}>
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-montserrat">{item.title || `Campanha ${item.uuid}`}</CardTitle>
                    <CardDescription className="font-nunito">
                      Campanha {item.uuid}
                      {item.overrides && Object.keys(item.overrides).length > 0 && ' · editada no site'}
                      {item.fetched_at && ` · lida ${formatDistanceToNow(new Date(item.fetched_at), { locale: ptBR, addSuffix: true })}`}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" asChild title="Ver no site" aria-label="Ver no site">
                      <a href={`/campanhas/${item.uuid}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(item)} title="Editar" aria-label="Editar">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRefresh(item)}
                      disabled={refreshingId === item.id}
                      title="Atualizar agora da Transforme.tech"
                      aria-label="Atualizar agora"
                    >
                      <RefreshCw className={`h-4 w-4 ${refreshingId === item.id ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(item)} className="text-red-600" title="Remover do site" aria-label="Remover do site">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CampaignSummary campaign={item} />
                {item.fetch_error && (
                  <p className="flex items-start gap-2 rounded-md bg-amber-50 p-2 text-xs text-amber-800">
                    <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    Última leitura falhou ({item.fetch_error}). O site continua mostrando os dados anteriores.
                  </p>
                )}
                {item.open === false && (
                  <p className="text-xs text-amber-700">Desativada na Transforme.tech: não aparece no site.</p>
                )}
                <div className="flex items-center justify-between gap-2 text-sm text-gray-600">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline text-xs">
                      Abrir na Transforme.tech
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : <span />}
                  <label className="flex items-center gap-2 cursor-pointer">
                    {!item.active && <EyeOff className="h-3.5 w-3.5" />}
                    <span className="text-xs">{item.active ? 'Publicada' : 'Oculta'}</span>
                    <Switch checked={item.active} onCheckedChange={() => handleToggleActive(item)} />
                  </label>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CampaignEditDialog
        item={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          loadCampaigns();
          refreshPublic();
        }}
      />
    </div>
  );
};

export default CampaignsManager;
