import { useState, useEffect } from 'react';
import Map from '@/components/Map';
import { Button } from '@/components/ui/button';
import { getCurrentProjects } from '@/data/mockData';
import { MapPin, Users, Calendar, Grid, Map as MapIcon } from 'lucide-react';

const Projects = () => {
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setAllProjects(getCurrentProjects());
  }, []);

  const categories = [
    { id: 'all', name: 'Todos os Projetos' },
    { id: 'Saúde Indígena', name: 'Saúde Indígena' },
    { id: 'Evangelização', name: 'Evangelização' },
    { id: 'Assistência Social', name: 'Assistência Social' },
    { id: 'Educação', name: 'Educação' }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? allProjects 
    : allProjects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#a0c93a' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">
              Nossos Projetos
            </h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90">
              Servindo os povos indígenas de Dourados e região desde 1928
            </p>
          </div>
        </div>
      </section>

      {/* Filtros e Controles */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Filtros por Categoria */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-sm"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Controles de Visualização */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4 mr-2" />
                Grade
              </Button>
              <Button
                variant={viewMode === 'map' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Mapa
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Visualização em Mapa */}
      {viewMode === 'map' && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                Localização dos Projetos
              </h2>
              <p className="text-gray-600 font-nunito">
                Clique nos marcadores para ver detalhes de cada projeto
              </p>
            </div>
            <Map locations={filteredProjects.map(p => ({
              id: p.id,
              title: p.title,
              description: p.description,
              location: p.location,
              beneficiaries: p.beneficiaries,
              coordinates: p.coordinates
            }))} />
          </div>
        </section>
      )}

      {/* Visualização em Grade */}
      {viewMode === 'grid' && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                {selectedCategory === 'all' ? 'Todos os Projetos' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-gray-600 font-nunito">
                {filteredProjects.length} projeto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Imagem */}
                  <div className="h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 font-montserrat">
                        {project.title}
                      </h3>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ 
                        backgroundColor: '#a0c93a20', 
                        color: '#3b660a' 
                      }}>
                        {categories.find(c => c.id === project.category)?.name}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 font-nunito leading-relaxed">
                      {project.fullDescription}
                    </p>

                    {/* Informações do Projeto */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Users className="h-4 w-4 mr-2 text-green-500" />
                        <span>{project.beneficiaries} beneficiários</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                        <span>Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <span className="font-medium">Orçamento: {project.budget}</span>
                      </div>
                    </div>

                    {/* Coordenador */}
                    <div className="mb-4">
                      <span className="text-sm text-gray-500">Coordenador: </span>
                      <span className="text-sm font-medium text-gray-900">{project.coordinator}</span>
                    </div>

                    {/* Conquistas */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 font-montserrat">
                        Principais Conquistas
                      </h4>
                      <ul className="space-y-2">
                        {project.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-600 font-nunito">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-3">
                      <Button className="flex-1" style={{ backgroundColor: '#e8440d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}>
                        Apoiar Projeto
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Saber Mais
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Estatísticas Gerais */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-montserrat">
              Impacto Geral dos Projetos
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2 font-montserrat" style={{ color: '#3b660a' }}>
                  5.000+
                </div>
                <div className="text-gray-600 font-nunito">Indígenas Atendidos</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2 font-montserrat" style={{ color: '#81a425' }}>
                  96
                </div>
                <div className="text-gray-600 font-nunito">Anos de História</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2 font-montserrat" style={{ color: '#e8440d' }}>
                  1
                </div>
                <div className="text-gray-600 font-nunito">Hospital Indígena</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2 font-montserrat" style={{ color: '#47623d' }}>
                  15+
                </div>
                <div className="text-gray-600 font-nunito">Aldeias Alcançadas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16" style={{ backgroundColor: '#2b4744' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
              Ajude-nos a Continuar Esta Missão
            </h2>
            <p className="text-xl mb-8 font-nunito opacity-90">
              Sua contribuição nos ajuda a continuar servindo os povos indígenas com amor e dedicação
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" style={{ backgroundColor: '#e8440d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}>
                Apoiar Projetos
              </Button>
              <Button size="lg" variant="outline" className="border-white" style={{ backgroundColor: 'transparent', color: 'white', borderColor: 'white' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#2b4744'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'white'; }}>
                Seja Voluntário
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;