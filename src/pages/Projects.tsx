import { useState } from 'react';
import Map from '@/components/Map';
import { Button } from '@/components/ui/button';
import { projects } from '@/data/mockData';
import { MapPin, Users, Calendar, Grid, Map as MapIcon } from 'lucide-react';

const Projects = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Todos os Projetos' },
    { id: 'education', name: 'Educação' },
    { id: 'health', name: 'Saúde' },
    { id: 'nutrition', name: 'Alimentação' },
    { id: 'community', name: 'Desenvolvimento Comunitário' }
  ];

  const projectDetails = [
    {
      ...projects[0],
      category: 'education',
      startDate: '2020-03-15',
      budget: 'R$ 250.000',
      coordinator: 'Ana Silva',
      fullDescription: 'Nosso programa de educação transformadora oferece ensino de qualidade para crianças de 6 a 14 anos em comunidades carentes. Além das disciplinas básicas, oferecemos aulas de informática, inglês e atividades extracurriculares que desenvolvem habilidades socioemocionais.',
      achievements: [
        '95% de aprovação escolar',
        '80% dos alunos melhoraram notas em matemática',
        '100% das crianças alfabetizadas até os 8 anos'
      ]
    },
    {
      ...projects[1],
      category: 'nutrition',
      startDate: '2019-08-20',
      budget: 'R$ 180.000',
      coordinator: 'Roberto Santos',
      fullDescription: 'Programa que garante alimentação nutritiva e balanceada para crianças em situação de insegurança alimentar. Inclui educação nutricional para famílias e hortas comunitárias.',
      achievements: [
        '3 refeições diárias para 800 crianças',
        '15 hortas comunitárias implementadas',
        '200 famílias capacitadas em educação nutricional'
      ]
    },
    {
      ...projects[2],
      category: 'health',
      startDate: '2021-01-10',
      budget: 'R$ 120.000',
      coordinator: 'Dra. Mariana Costa',
      fullDescription: 'Programa de saúde preventiva que oferece consultas médicas, odontológicas e acompanhamento psicológico para crianças e suas famílias.',
      achievements: [
        '2.500 consultas médicas realizadas',
        '1.800 atendimentos odontológicos',
        '500 crianças com acompanhamento psicológico'
      ]
    },
    {
      ...projects[3],
      category: 'community',
      startDate: '2022-05-01',
      budget: 'R$ 200.000',
      coordinator: 'Carlos Oliveira',
      fullDescription: 'Programa de capacitação profissional e geração de renda para pais e responsáveis, criando oportunidades de trabalho e empreendedorismo nas comunidades.',
      achievements: [
        '150 pessoas capacitadas profissionalmente',
        '80 microempreendimentos criados',
        '60% de aumento na renda familiar média'
      ]
    }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projectDetails 
    : projectDetails.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">
              Nossos Projetos
            </h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90">
              Conheça como estamos transformando vidas em diferentes comunidades
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
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
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
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
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
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 font-montserrat">
                  {projects.reduce((total, project) => total + project.beneficiaries, 0).toLocaleString()}
                </div>
                <div className="text-gray-600 font-nunito">Beneficiários Diretos</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2 font-montserrat">
                  {projects.length}
                </div>
                <div className="text-gray-600 font-nunito">Projetos Ativos</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2 font-montserrat">
                  4
                </div>
                <div className="text-gray-600 font-nunito">Estados Atendidos</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2 font-montserrat">
                  25
                </div>
                <div className="text-gray-600 font-nunito">Comunidades</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
              Ajude-nos a Expandir Nosso Impacto
            </h2>
            <p className="text-xl mb-8 font-nunito opacity-90">
              Com sua ajuda, podemos levar nossos projetos para mais comunidades e transformar ainda mais vidas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Apoiar Projetos
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
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