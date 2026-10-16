import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Calendar, Loader2, EyeOff } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import ImageField from './ImageField';
import RichTextEditor from './RichTextEditor';
import { newsApi, type NewsItem } from '@/lib/api';
import { NEWS_CATEGORIES, newsCategoryLabel } from '@/lib/categories';
import { formatDate } from '@/lib/format';
import { IMAGE_FORMATS } from '@/lib/imageFormats';
import { toast } from 'sonner';

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = () => ({
  title: '',
  subtitle: '',
  date: today(),
  category: 'geral',
  image: '',
  content: '',
  author: '',
  active: true,
});

const NewsManager = () => {
  const queryClient = useQueryClient();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadNews = async () => {
    try {
      setNews(await newsApi.list(true));
    } catch (error) {
      toast.error('Erro ao carregar notícias');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Atualiza o site público (menu, página inicial) após mudanças
  const refreshPublic = () => queryClient.invalidateQueries({ queryKey: ['public', 'news'] });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingNews) {
        await newsApi.update(editingNews.id, formData);
        toast.success('Notícia atualizada!');
      } else {
        await newsApi.create(formData);
        toast.success('Notícia adicionada!');
      }
      setIsDialogOpen(false);
      resetForm();
      await loadNews();
      refreshPublic();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar notícia');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      subtitle: item.subtitle,
      date: item.date,
      category: item.category || 'geral',
      image: item.image,
      content: item.content,
      author: item.author,
      active: item.active,
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (item: NewsItem) => {
    try {
      await newsApi.update(item.id, { active: !item.active });
      await loadNews();
      refreshPublic();
    } catch (error) {
      toast.error('Erro ao atualizar notícia');
    }
  };

  const handleDelete = async (item: NewsItem) => {
    if (!confirm(`Excluir a notícia "${item.title}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await newsApi.remove(item.id);
      await loadNews();
      refreshPublic();
      toast.success('Notícia excluída!');
    } catch (error) {
      toast.error('Erro ao excluir notícia');
    }
  };

  const resetForm = () => {
    setEditingNews(null);
    setFormData(emptyForm());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-montserrat">Gerenciar Notícias</h2>
          <p className="text-gray-600 font-nunito">
            Notícias desativadas ficam escondidas do site. Sem notícias ativas, a seção some do site.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#3b660a' }} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Notícia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingNews ? 'Editar Notícia' : 'Nova Notícia'}</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para {editingNews ? 'atualizar' : 'adicionar'} uma notícia
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo / resumo *</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(NEWS_CATEGORIES).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="news-image">Imagem</Label>
                <ImageField
                  id="news-image"
                  value={formData.image}
                  onChange={(image) => setFormData((prev) => ({ ...prev, image }))}
                  crop={IMAGE_FORMATS.card}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Autor *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo *</Label>
                <RichTextEditor
                  id="content"
                  value={formData.content}
                  onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                  required
                />
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label htmlFor="news-active" className="cursor-pointer">Publicada no site</Label>
                  <p className="text-xs text-gray-500">Desative para esconder sem excluir.</p>
                </div>
                <Switch
                  id="news-active"
                  checked={formData.active}
                  onCheckedChange={(active) => setFormData({ ...formData, active })}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving} style={{ backgroundColor: '#3b660a' }}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingNews ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Notícias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : news.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center text-gray-500">
              Nenhuma notícia cadastrada. Clique em "Nova Notícia" para começar.
            </CardContent>
          </Card>
        ) : (
          news.map((item) => (
            <Card key={item.id} className={item.active ? '' : 'opacity-60'}>
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-montserrat">{item.title}</CardTitle>
                    <CardDescription className="font-nunito">{item.subtitle}</CardDescription>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)} title="Editar" aria-label="Editar">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(item)} className="text-red-600" title="Excluir" aria-label="Excluir">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {item.image && <img src={item.image} alt={item.title} className="w-full aspect-[2/1] object-cover rounded mb-3" />}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: '#a0c93a30', color: '#3b660a' }}>
                    {newsCategoryLabel(item.category)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.date)}
                  </div>
                  <label className="flex items-center gap-2 ml-auto cursor-pointer">
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

export default NewsManager;
