import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { news } from '@/data/mockData';
import { Search, Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const News = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const itemsPerPage = 6;

  // Expandir dados de notícias com mais conteúdo
  const expandedNews = [
    ...news,
    {
      id: 4,
      title: "Novo Equipamento Médico no Hospital",
      excerpt: "Hospital Indígena recebe equipamentos modernos para melhor atendimento à comunidade.",
      content: "Graças a parceiros e doadores, o Hospital Indígena recebeu novos equipamentos de diagnóstico que vão melhorar significativamente a qualidade do atendimento prestado às comunidades indígenas.",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&h=400&fit=crop",
      date: "2023-10-15",
      author: "Dra. Maria Santos",
      category: "saude"
    },
    {
      id: 5,
      title: "Capacitação de Líderes Indígenas",
      excerpt: "Realizado curso de capacitação bíblica para 40 líderes de diferentes aldeias.",
      content: "Durante três dias, líderes indígenas participaram de um intenso curso de capacitação bíblica, fortalecendo seu conhecimento das Escrituras e habilidades ministeriais para servir melhor suas comunidades.",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop",
      date: "2023-09-20",
      author: "Pastor Carlos Mendes",
      category: "evangelizacao"
    },
    {
      id: 6,
      title: "Ação Social Beneficia Aldeia Jaguapiru",
      excerpt: "Distribuição de alimentos e roupas alcança mais de 150 famílias na aldeia.",
      content: "Nossa equipe realizou uma grande ação social na Aldeia Jaguapiru, distribuindo cestas básicas, roupas e materiais de higiene para as famílias mais necessitadas, demonstrando o amor prático de Cristo.",
      image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop",
      date: "2023-08-10",
      author: "Equipe Social",
      category: "assistencia"
    }
  ];

  const categories = [
    { id: 'all', name: 'Todas as Categorias' },
    { id: 'saude', name: 'Saúde' },
    { id: 'evangelizacao', name: 'Evangelização' },
    { id: 'assistencia', name: 'Assistência Social' },
    { id: 'geral', name: 'Geral' }
  ];

  // Filtrar notícias
  const filteredNews = expandedNews.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || (article as any).category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Paginação
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#a0c93a' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">
              Notícias e Atualizações
            </h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90">
              Fique por dentro das nossas ações, conquistas e histórias inspiradoras
            </p>
          </div>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Busca */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar notícias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtros por Categoria */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentPage(1);
                  }}
                  className="text-sm"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notícia em Destaque */}
      {currentPage === 1 && filteredNews.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 font-montserrat">
                Notícia em Destaque
              </h2>
              
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={filteredNews[0].image}
                      alt={filteredNews[0].title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center mb-4 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(filteredNews[0].date)}</span>
                      <User className="h-4 w-4 ml-4 mr-2" />
                      <span>{filteredNews[0].author}</span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-montserrat">
                      {filteredNews[0].title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 font-nunito leading-relaxed">
                      {filteredNews[0].excerpt}
                    </p>
                    
                    <Button asChild style={{ backgroundColor: '#3b660a' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2b4744'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b660a'}>
                      <Link to={`/noticias/${filteredNews[0].id}`}>
                        Ler Matéria Completa
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Lista de Notícias */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 font-montserrat">
                {currentPage === 1 ? 'Outras Notícias' : 'Notícias'}
              </h2>
              <p className="text-gray-600 font-nunito">
                {filteredNews.length} notícia{filteredNews.length !== 1 ? 's' : ''} encontrada{filteredNews.length !== 1 ? 's' : ''}
              </p>
            </div>

            {currentNews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg font-nunito">
                  Nenhuma notícia encontrada com os filtros selecionados.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentNews.slice(currentPage === 1 ? 1 : 0).map((article) => (
                  <Card
                    key={article.id}
                    title={article.title}
                    description={article.excerpt}
                    image={article.image}
                    date={article.date}
                    author={article.author}
                    link={`/noticias/${article.id}`}
                    linkText="Ler Mais"
                    variant="news"
                  />
                ))}
              </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-12 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16" style={{ backgroundColor: '#2b4744' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
              Não Perca Nenhuma Novidade
            </h2>
            <p className="text-xl mb-8 font-nunito opacity-90">
              Inscreva-se em nossa newsletter e receba as últimas atualizações sobre nossos projetos
            </p>
            <Button asChild size="lg" style={{ backgroundColor: '#e8440d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}>
              <Link to="/#newsletter">
                Inscrever-se na Newsletter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;