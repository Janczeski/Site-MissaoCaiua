import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertTriangle, ExternalLink, Eye, EyeOff, Image as ImageIcon, Loader2, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { formatBRL } from '@/components/donation/DonationLayout';
import { campaignsApi, type CampaignData, type CampaignItem } from '@/lib/api';

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
                      {item.fetched_at && ` · lida ${formatDistanceToNow(new Date(item.fetched_at), { locale: ptBR, addSuffix: true })}`}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" asChild title="Ver no site" aria-label="Ver no site">
                      <a href={`/campanhas/${item.uuid}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
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
    </div>
  );
};

export default CampaignsManager;
