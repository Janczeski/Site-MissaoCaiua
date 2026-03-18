import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { getNews, addNews, updateNews, deleteNews, type NewsItem } from '@/utils/storage';
import { toast } from 'sonner';

const NewsManager = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'saúde',
    image: '',
    content: '',
    author: 'Missão Caiuá',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = () => {
    setNews(getNews());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingNews) {
        updateNews(editingNews.id, formData);
        toast.success('Notícia atualizada com sucesso!');
      } else {
        addNews(formData);
        toast.success('Notícia adicionada com sucesso!');
      }
      
      resetForm();
      loadNews();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar notícia');
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      image: item.image,
      content: item.content,
      author: item.author,
      date: item.date
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta notícia?')) {
      deleteNews(id);
      loadNews();
      toast.success('Notícia excluída com sucesso!');
    }
  };

  const resetForm = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      subtitle: '',
      category: 'saúde',
      image: '',
      content: '',
      author: 'Missão Caiuá',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-montserrat">Gerenciar Notícias</h2>
          <p className="text-gray-600 font-nunito">Adicione, edite ou remova notícias do site</p>
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                <Label htmlFor="subtitle">Subtítulo *</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saúde">Saúde</SelectItem>
                      <SelectItem value="evangelização">Evangelização</SelectItem>
                      <SelectItem value="assistência">Assistência Social</SelectItem>
                      <SelectItem value="geral">Geral</SelectItem>
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
                <Label htmlFor="image">URL da Imagem *</Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
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
                <Textarea
                  id="content"
                  rows={8}
                  placeholder="Digite o conteúdo completo da notícia..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" style={{ backgroundColor: '#3b660a' }}>
                  {editingNews ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Notícias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="py-12 text-center text-gray-500">
              Nenhuma notícia cadastrada. Clique em "Nova Notícia" para começar.
            </CardContent>
          </Card>
        ) : (
          news.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-montserrat">{item.title}</CardTitle>
                    <CardDescription className="font-nunito">{item.subtitle}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded mb-3" />
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: '#a0c93a30', color: '#3b660a' }}>
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </div>
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
