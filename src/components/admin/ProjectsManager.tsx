import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, MapPin, DollarSign, Loader2 } from 'lucide-react';
import { getProjects, addProject, updateProject, deleteProject, uploadImage, type ProjectItem } from '@/utils/storage';
import { toast } from 'sonner';

const ProjectsManager = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Saúde Indígena',
    location: 'Dourados - MS',
    coordinates: [-22.2211, -54.8056] as [number, number],
    image: '',
    raised: 0,
    goal: 50000
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Erro ao carregar projetos');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'projects');
      setFormData({ ...formData, image: imageUrl });
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar imagem');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
        toast.success('Projeto atualizado com sucesso!');
      } else {
        await addProject(formData);
        toast.success('Projeto adicionado com sucesso!');
      }
      
      resetForm();
      await loadProjects();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar projeto');
    }
  };

  const handleEdit = (item: ProjectItem) => {
    setEditingProject(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      coordinates: item.coordinates as [number, number],
      image: item.image,
      raised: item.raised,
      goal: item.goal
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await deleteProject(id);
        await loadProjects();
        toast.success('Projeto excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir projeto');
      }
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      category: 'Saúde Indígena',
      location: 'Dourados - MS',
      coordinates: [-22.2211, -54.8056],
      image: '',
      raised: 0,
      goal: 50000
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-montserrat">Gerenciar Projetos</h2>
          <p className="text-gray-600 font-nunito">Adicione, edite ou remova projetos do site</p>
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
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                      <SelectItem value="Saúde Indígena">Saúde Indígena</SelectItem>
                      <SelectItem value="Evangelização">Evangelização</SelectItem>
                      <SelectItem value="Assistência Social">Assistência Social</SelectItem>
                      <SelectItem value="Educação">Educação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localização *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude *</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={formData.coordinates[0]}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      coordinates: [parseFloat(e.target.value), formData.coordinates[1]]
                    })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude *</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={formData.coordinates[1]}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      coordinates: [formData.coordinates[0], parseFloat(e.target.value)]
                    })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Imagem *</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="flex-1"
                  />
                  {isUploading && <Loader2 className="h-5 w-5 animate-spin" />}
                </div>
                <Input
                  id="image"
                  type="url"
                  placeholder="Ou cole a URL da imagem"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                  className="mt-2"
                />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="raised">Valor Arrecadado (R$) *</Label>
                  <Input
                    id="raised"
                    type="number"
                    min="0"
                    value={formData.raised}
                    onChange={(e) => setFormData({ ...formData, raised: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Meta (R$) *</Label>
                  <Input
                    id="goal"
                    type="number"
                    min="0"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" style={{ backgroundColor: '#3b660a' }}>
                  {editingProject ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="py-12 text-center text-gray-500">
              Nenhum projeto cadastrado. Clique em "Novo Projeto" para começar.
            </CardContent>
          </Card>
        ) : (
          projects.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-montserrat">{item.title}</CardTitle>
                    <CardDescription className="font-nunito">{item.description.substring(0, 100)}...</CardDescription>
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
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: '#a0c93a30', color: '#3b660a' }}>
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3" />
                    <span>R$ {item.raised.toLocaleString()} / R$ {item.goal.toLocaleString()}</span>
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

export default ProjectsManager;
