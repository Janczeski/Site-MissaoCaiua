import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Users, Target, Award, Calendar, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const About = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  const milestones = [
    {
      year: "1928",
      title: "Fundação da Missão",
      description: "Início do trabalho missionário junto aos povos indígenas da região de Dourados"
    },
    {
      year: "1940",
      title: "Expansão do Trabalho",
      description: "Estabelecimento de novos pontos de evangelização em aldeias indígenas"
    },
    {
      year: "1950",
      title: "Primeiras Escolas",
      description: "Criação das primeiras escolas para educação dos povos indígenas"
    },
    {
      year: "1972",
      title: "Hospital Indígena",
      description: "Inauguração do Hospital Evangélico, único hospital de média complexidade indígena do Brasil"
    },
    {
      year: "1985",
      title: "Programa de Assistência",
      description: "Ampliação dos programas de assistência social e alimentar"
    },
    {
      year: "2000",
      title: "Modernização",
      description: "Modernização das instalações e equipamentos médicos do hospital"
    },
    {
      year: "2010",
      title: "Expansão Digital",
      description: "Implementação de sistemas digitais e ampliação do alcance ministerial"
    },
    {
      year: "2020",
      title: "Hospital em Pandemia",
      description: "Papel crucial no atendimento às comunidades indígenas durante a pandemia"
    },
    {
      year: "2028",
      title: "Centenário da Missão",
      description: "Celebração de 100 anos de serviço aos povos indígenas"
    }
  ];

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (timelineRef.current) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      timelineRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  const team = [
    {
      name: "Rev. João Silva",
      role: "Diretor Geral",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop", 
      description: "Líder ministerial com 25 anos dedicados à evangelização indígena"
    },
    {
      name: "Dra. Maria Santos",
      role: "Diretora do Hospital",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop",
      description: "Médica especializada em saúde indígena"
    },
    {
      name: "Pastor Carlos Mendes",
      role: "Coordenador de Evangelização",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      description: "Missionário atuante nas aldeias há 15 anos"
    },
    {
      name: "Ana Paula Costa",
      role: "Coordenadora de Projetos Sociais",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      description: "Assistente social dedicada ao desenvolvimento comunitário"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#a0c93a' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">
              Quem Somos
            </h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90">
              Conheça nossa história, missão e as pessoas que fazem a diferença todos os dias
            </p>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center font-montserrat">
              Nossa História
            </h2>
            
            <div className="prose prose-lg max-w-none font-nunito">
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                A Missão Caiuá nasceu em 1999 do sonho de um grupo de educadores e assistentes sociais 
                que acreditavam no poder transformador da educação. Começamos pequenos, atendendo apenas 
                20 crianças em uma sala emprestada no centro de São Paulo.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Ao longo dos anos, nossa missão se expandiu para além da educação formal. Percebemos que 
                para realmente transformar vidas, precisávamos abordar as necessidades básicas das crianças 
                e suas famílias: alimentação, saúde, desenvolvimento emocional e capacitação profissional.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Hoje, somos uma organização consolidada que atua em múltiplas frentes, sempre com o mesmo 
                objetivo: dar às crianças em situação de vulnerabilidade as ferramentas necessárias para 
                construir um futuro melhor.
              </p>
            </div>

            {/* Missão, Visão e Valores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#a0c93a20' }}>
                <Heart className="h-12 w-12 mx-auto mb-4" style={{ color: '#e8440d' }} />
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-montserrat">Missão</h3>
                <p className="text-gray-600 font-nunito">
                  Promover o desenvolvimento integral de crianças e adolescentes em situação de 
                  vulnerabilidade social através de programas educacionais, de saúde e desenvolvimento comunitário.
                </p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-montserrat">Visão</h3>
                <p className="text-gray-600 font-nunito">
                  Ser referência nacional em programas de desenvolvimento infantil, contribuindo para 
                  um mundo onde toda criança tenha oportunidades iguais de crescer e prosperar.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#81a42520' }}>
                <Award className="h-12 w-12 mx-auto mb-4" style={{ color: '#81a425' }} />
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-montserrat">Valores</h3>
                <p className="text-gray-600 font-nunito">
                  Transparência, respeito à dignidade humana, solidariedade, compromisso com a 
                  transformação social e sustentabilidade dos projetos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Linha do Tempo Horizontal */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center font-montserrat">
              Nossa Trajetória
            </h2>
            
            <div className="relative">
              {/* Botões de navegação */}
              <button
                onClick={() => scrollTimeline('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              
              <button
                onClick={() => scrollTimeline('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Próximo"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>

              {/* Timeline Container */}
              <div 
                ref={timelineRef}
                className="overflow-x-auto scrollbar-hide px-12"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex space-x-8 pb-8">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex-shrink-0 w-72">
                      <div className="relative">
                        {/* Linha conectora */}
                        {index < milestones.length - 1 && (
                          <div className="absolute top-8 left-full w-8 h-0.5 bg-green-300" />
                        )}
                        
                        {/* Círculo do ano */}
                        <div className="flex justify-center mb-4">
                          <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm shadow-lg">
                            {milestone.year}
                          </div>
                        </div>
                        
                        {/* Card de conteúdo */}
                        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-100 hover:border-green-500 transition-all">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                            {milestone.title}
                          </h3>
                          <p className="text-gray-600 text-sm font-nunito">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Indicação de scroll */}
              <div className="text-center mt-4 text-sm text-gray-500 font-nunito">
                Arraste para ver toda a história →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center font-montserrat">
              Nossa Equipe
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 font-montserrat">
                    {member.name}
                  </h3>
                  <p className="font-medium mb-2 font-nunito" style={{ color: '#3b660a' }}>
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm font-nunito">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transparência */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-montserrat">
              Transparência e Prestação de Contas
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-nunito">
              Acreditamos que a transparência é fundamental para manter a confiança de nossos 
              apoiadores e beneficiários. Todos os nossos relatórios financeiros e de atividades 
              estão disponíveis para consulta.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Calendar className="h-8 w-8 mx-auto mb-4" style={{ color: '#81a425' }} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                  Relatórios Anuais
                </h3>
                <p className="text-gray-600 text-sm font-nunito">
                  Relatórios detalhados de nossas atividades e impacto social
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                  Prestação de Contas
                </h3>
                <p className="text-gray-600 text-sm font-nunito">
                  Demonstrativos financeiros auditados e certificações
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <MapPin className="h-8 w-8 mx-auto mb-4" style={{ color: '#e8440d' }} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                  Onde Atuamos
                </h3>
                <p className="text-gray-600 text-sm font-nunito">
                  Mapeamento detalhado de todos os nossos projetos ativos
                </p>
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
              Faça Parte da Nossa História
            </h2>
            <p className="text-xl mb-8 font-nunito opacity-90">
              Junte-se a nós nesta missão de transformar vidas e construir um futuro melhor para nossas crianças
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" style={{ backgroundColor: '#e8440d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}>
              <Link to="/como-ajudar">
                  Apoiar a Missão
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white" onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#2b4744'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'white'; }}>
                <Link to="/doacao">
                  Fazer Doação
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;