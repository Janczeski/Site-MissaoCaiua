import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, MapPin, DollarSign, Loader2, EyeOff } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import ImageField from './ImageField';
import { projectsApi, type ProjectItem } from '@/lib/api';
import { toast } from 'sonner';

const DEFAULT_CATEGORIES = ['Saúde Indígena', 'Evangelização', 'Assistência Social', 'Educação'];
const DOURADOS: [number, number] = [-22.2211, -54.8056];

const emptyForm = () => ({
  title: '',
  description: '',
  category: DEFAULT_CATEGORIES[0],
  location: 'Dourados - MS',
  coordinates: DOURADOS,
  image: '',
  raised: 0,
  goal: 0,
  donation_link: '',
  show_goal: false,
  active: true,
});

const ProjectsManager = () => {
  const queryClient = useQueryClient();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const categories = Array.from(new Set([...DEFAULT_CATEGORIES, ...projects.map((p) => p.category).filter(Boolean)]));

  const loadProjects = async () => {
    try {
      setProjects(await projectsApi.list(true));
    } catch (error) {
      toast.error('Erro ao carregar projetos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Atualiza o site público (menu, página inicial) após mudanças
  const refreshPublic = () => queryClient.invalidateQueries({ queryKey: ['public', 'projects'] });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const data = {
      ...formData,
      coordinates: formData.coordinates.map((c, i) => (Number.isFinite(c) ? c : DOURADOS[i])) as [number, number],
    };
    try {
      if (editingProject) {
        await projectsApi.update(editingProject.id, data);
        toast.success('Projeto atualizado!');
      } else {
        await projectsApi.create(data);
        toast.success('Projeto adicionado!');
      }
      setIsDialogOpen(false);
      resetForm();
      await loadProjects();
      refreshPublic();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar projeto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: ProjectItem) => {
    setEditingProject(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      coordinates: item.coordinates,
      image: item.image,
      raised: item.raised,
      goal: item.goal,
      donation_link: item.donation_link || '',
      show_goal: item.show_goal,
      active: item.active,
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (item: ProjectItem) => {
    try {
      await projectsApi.update(item.id, { active: !item.active });
      await loadProjects();
      refreshPublic();
    } catch (error) {
      toast.error('Erro ao atualizar projeto');
    }
  };

  const handleDelete = async (item: ProjectItem) => {
    if (!confirm(`Excluir o projeto "${item.title}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await projectsApi.remove(item.id);
      await loadProjects();
      refreshPublic();
      toast.success('Projeto excluído!');
    } catch (error) {
      toast.error('Erro ao excluir projeto');
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData(emptyForm());
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-montserrat">Gerenciar Projetos</h2>
          <p className="text-gray-600 font-nunito">
            Projetos desativados ficam escondidos do site. Sem projetos ativos, a seção some do site.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#3b660a' }} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Editar Projeto' : 'Novo Projeto'}</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para {editingProject ? 'atualizar' : 'adicionar'} um projeto
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
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Input
                    id="category"
                    list="project-categories"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                  <datalist id="project-categories">
                    {categories.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude (mapa)</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={Number.isFinite(formData.coordinates[0]) ? formData.coordinates[0] : ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      coordinates: [parseFloat(e.target.value), formData.coordinates[1]],
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude (mapa)</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={Number.isFinite(formData.coordinates[1]) ? formData.coordinates[1] : ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      coordinates: [formData.coordinates[0], parseFloat(e.target.value)],
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-image">Imagem</Label>
                <ImageField
                  id="project-image"
                  value={formData.image}
                  onChange={(image) => setFormData((prev) => ({ ...prev, image }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donation_link">Link de doação (opcional)</Label>
                <Input
                  id="donation_link"
                  placeholder="https://..."
                  value={formData.donation_link}
                  onChange={(e) => setFormData({ ...formData, donation_link: e.target.value })}
                />
                <p className="text-xs text-gray-500">Para onde vai o botão "Apoiar Projeto". Em branco, usa o link padrão da página.</p>
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <Label htmlFor="show_goal" className="cursor-pointer">Exibir meta de arrecadação</Label>
                <Switch
                  id="show_goal"
                  checked={formData.show_goal}
                  onCheckedChange={(show_goal) => setFormData({ ...formData, show_goal })}
                />
              </div>

              {formData.show_goal && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="raised">Valor arrecadado (R$)</Label>
                    <Input
                      id="raised"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.raised}
                      onChange={(e) => setFormData({ ...formData, raised: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal">Meta (R$)</Label>
                    <Input
                      id="goal"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label htmlFor="project-active" className="cursor-pointer">Publicado no site</Label>
                  <p className="text-xs text-gray-500">Desative para esconder sem excluir.</p>
                </div>
                <Switch
                  id="project-active"
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
                  {editingProject ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center text-gray-500">
              Nenhum projeto cadastrado. Clique em "Novo Projeto" para começar.
            </CardContent>
          </Card>
        ) : (
          projects.map((item) => (
            <Card key={item.id} className={item.active ? '' : 'opacity-60'}>
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-montserrat">{item.title}</CardTitle>
                    <CardDescription className="font-nunito line-clamp-2">{item.description}</CardDescription>
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
                {item.image && <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded mb-3" />}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex flex-wrap items-center gap-3">
                    {item.category && (
                      <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: '#a0c93a30', color: '#3b660a' }}>
                        {item.category}
                      </span>
                    )}
                    {item.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </div>
                    )}
                  </div>
                  {item.show_goal && item.goal > 0 && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(item.raised)} / {formatCurrency(item.goal)}
                    </div>
                  )}
                  <label className="flex items-center gap-2 justify-end cursor-pointer">
                    {!item.active && <EyeOff className="h-3.5 w-3.5" />}
                    <span className="text-xs">{item.active ? 'Publicado' : 'Oculto'}</span>
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

export default ProjectsManager;
