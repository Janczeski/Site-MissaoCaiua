import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Edit, ExternalLink, FileText, FileUp, Loader2, Plus, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { documentsApi, uploadFile, type DocumentItem } from '@/lib/api';
import { formatDate, formatSize } from '@/lib/format';
import { toast } from 'sonner';

const MAX_PDF_BYTES = 30 * 1024 * 1024;

const emptyForm = () => ({
  title: '',
  description: '',
  category: '',
  date: new Date().toISOString().slice(0, 10),
  file_url: '',
  file_name: '',
  file_size: 0,
  active: true,
});

const DocumentsManager = () => {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DocumentItem | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const categories = Array.from(new Set(documents.map((d) => d.category).filter(Boolean)));

  const loadDocuments = async () => {
    try {
      setDocuments(await documentsApi.list(true));
    } catch (error) {
      toast.error('Erro ao carregar documentos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const refreshPublic = () => queryClient.invalidateQueries({ queryKey: ['public', 'documents'] });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Selecione um arquivo PDF.');
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      toast.error('PDF muito grande. Máximo 30MB.');
      return;
    }

    setIsUploading(true);
    try {
      const { url, name, size } = await uploadFile(file);
      setFormData((prev) => ({
        ...prev,
        file_url: url,
        file_name: name,
        file_size: size,
        // Sugere o nome do arquivo como título se ainda não houver um
        title: prev.title || name.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' '),
      }));
      toast.success('PDF enviado!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file_url) {
      toast.error('Envie o arquivo PDF antes de salvar.');
      return;
    }
    setIsSaving(true);
    try {
      if (editing) {
        await documentsApi.update(editing.id, formData);
        toast.success('Documento atualizado!');
      } else {
        await documentsApi.create(formData);
        toast.success('Documento publicado!');
      }
      setIsDialogOpen(false);
      resetForm();
      await loadDocuments();
      refreshPublic();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar documento');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (doc: DocumentItem) => {
    setEditing(doc);
    setFormData({
      title: doc.title,
      description: doc.description,
      category: doc.category,
      date: doc.date,
      file_url: doc.file_url,
      file_name: doc.file_name,
      file_size: doc.file_size,
      active: doc.active,
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (doc: DocumentItem) => {
    try {
      await documentsApi.update(doc.id, { active: !doc.active });
      await loadDocuments();
      refreshPublic();
    } catch (error) {
      toast.error('Erro ao atualizar documento');
    }
  };

  const handleDelete = async (doc: DocumentItem) => {
    if (!confirm(`Excluir o documento "${doc.title}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await documentsApi.remove(doc.id);
      await loadDocuments();
      refreshPublic();
      toast.success('Documento excluído!');
    } catch (error) {
      toast.error('Erro ao excluir documento');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData(emptyForm());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-montserrat">Transparência</h2>
          <p className="text-gray-600 font-nunito">
            PDFs publicados na página{' '}
            <a href="/transparencia" target="_blank" rel="noopener noreferrer" className="underline">/transparencia</a>
            , com link no rodapé do site.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#3b660a' }} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar Documento' : 'Novo Documento'}</DialogTitle>
              <DialogDescription>Envie o PDF e dê um título para ele aparecer no site.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Arquivo PDF *</Label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-md border border-dashed p-3">
                  <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={isUploading}>
                    {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileUp className="h-4 w-4 mr-2" />}
                    {isUploading ? 'Enviando...' : formData.file_url ? 'Trocar PDF' : 'Escolher PDF'}
                  </Button>
                  {formData.file_url ? (
                    <a
                      href={formData.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-700 underline break-all"
                    >
                      {formData.file_name || 'documento.pdf'}
                      {formData.file_size > 0 && ` (${formatSize(formData.file_size)})`}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500">Nenhum arquivo enviado (máx. 30MB)</span>
                  )}
                  <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={handleFile} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc-title">Título *</Label>
                <Input
                  id="doc-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex.: Relatório Anual 2025"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc-description">Descrição (opcional)</Label>
                <Textarea
                  id="doc-description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doc-category">Categoria (opcional)</Label>
                  <Input
                    id="doc-category"
                    list="doc-categories"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex.: Relatórios"
                  />
                  <datalist id="doc-categories">
                    {Array.from(new Set(['Relatórios', 'Prestação de Contas', 'Estatuto e Atas', 'Certidões', ...categories])).map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-date">Data *</Label>
                  <Input
                    id="doc-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <Label htmlFor="doc-active" className="cursor-pointer">Publicado no site</Label>
                <Switch
                  id="doc-active"
                  checked={formData.active}
                  onCheckedChange={(active) => setFormData({ ...formData, active })}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving || isUploading} style={{ backgroundColor: '#3b660a' }}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editing ? 'Atualizar' : 'Publicar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Nenhum documento publicado. Clique em "Novo Documento" para enviar um PDF.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <Card key={doc.id} className={doc.active ? '' : 'opacity-60'}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <FileText className="h-8 w-8 flex-shrink-0" style={{ color: '#e8440d' }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 break-words">{doc.title}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(doc.date)}
                    {doc.category && ` · ${doc.category}`}
                    {doc.file_size > 0 && ` · ${formatSize(doc.file_size)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <label className="flex items-center gap-2 mr-2 cursor-pointer">
                    <span className="text-xs text-gray-600">{doc.active ? 'Publicado' : 'Oculto'}</span>
                    <Switch checked={doc.active} onCheckedChange={() => handleToggleActive(doc)} />
                  </label>
                  <Button asChild size="sm" variant="outline" title="Abrir PDF" aria-label="Abrir PDF">
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(doc)} title="Editar" aria-label="Editar">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(doc)} className="text-red-600" title="Excluir" aria-label="Excluir">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsManager;
