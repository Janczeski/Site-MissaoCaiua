import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Carousel from '@/components/Carousel';
import Card from '@/components/Card';
import Map from '@/components/Map';
import Newsletter from '@/components/Newsletter';
import { heroSlides, impactNumbers, projects, news } from '@/data/mockData';
import { Heart, Users, Target, Award, ArrowRight, MessageCircle } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section com Carrossel */}
      <section className="relative">
        <Carousel items={heroSlides} />
      </section>

      {/* Seção Sobre Nós Resumida */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-montserrat">
              Transformando Vidas desde 1928
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-nunito leading-relaxed">
              A história da Missão Caiuá é longa, e seus feitos são muitos. Localizada em Dourados, MS, faz parte da vida de muitas pessoas, e leva o trabalho e a palavra de Cristo as comunidades indígenas da região.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">Missão</h3>
                <p className="text-gray-600 font-nunito">
                  Evangelizar e servir povos indígenas, promovendo cuidado espiritual, educacional, social e humano integral.
                </p>
              </div>
              <div className="text-center">
                <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">Visão</h3>
                <p className="text-gray-600 font-nunito">
                  Ser referência missionária no cuidado integral, promovendo transformação social e espiritual duradoura.
                </p>
              </div>
              <div className="text-center">
                <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">Valores</h3>
                <p className="text-gray-600 font-nunito">
                  Fé cristã, amor ao próximo, serviço, ética, respeito cultural, compromisso social e dignidade humana.
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/quem-somos">
                Conheça Nossa História
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Seção Impacto em Números */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
              Nosso Impacto em Números
            </h2>
            <p className="text-lg text-gray-600 font-nunito">
              Veja como juntos estamos transformando vidas e comunidades
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactNumbers.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 font-montserrat">
                  {item.number}
                </div>
                <div className="text-gray-600 font-nunito">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Projetos com Mapa */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
              Nossos Projetos
            </h2>
            <p className="text-lg text-gray-600 font-nunito">
              Conheça onde atuamos e como estamos fazendo a diferença
            </p>
          </div>
          
          <div className="mb-12">
            <Map locations={projects} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                location={project.location}
                beneficiaries={project.beneficiaries}
                link="/projetos"
                linkText="Ver Detalhes"
                variant="project"
              />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline">
              <Link to="/projetos">
                Ver Todos os Projetos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Seção Como Ajudar */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
              Como Você Pode Ajudar
            </h2>
            <p className="text-lg text-gray-600 font-nunito">
              Existem várias formas de fazer parte desta transformação
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 text-center">
              <Heart className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                Apadrinhamento
              </h3>
              <p className="text-gray-600 mb-6 font-nunito">
                Apadrinhe uma criança e acompanhe de perto seu desenvolvimento. 
                Receba cartas, fotos e relatórios sobre o progresso do seu afilhado.
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/apadrinhamento">Apadrinhar Criança</Link>
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-8 text-center">
              <Users className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                Doação
              </h3>
              <p className="text-gray-600 mb-6 font-nunito">
                Faça uma doação única ou recorrente para apoiar nossos projetos. 
                Cada contribuição faz a diferença na vida de uma criança.
              </p>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link to="/doacao">Fazer Doação</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Notícias */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
              Últimas Notícias
            </h2>
            <p className="text-lg text-gray-600 font-nunito">
              Fique por dentro das nossas ações e conquistas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.slice(0, 3).map((article) => (
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
          
          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline">
              <Link to="/noticias">
                Ver Todas as Notícias
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* Chat Placeholder */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          className="rounded-full bg-green-500 hover:bg-green-600 shadow-lg h-14 w-14 p-0"
          title="Chat de Atendimento"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Index;