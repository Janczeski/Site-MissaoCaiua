import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Users, Target, Award, Calendar, MapPin, ArrowRight } from 'lucide-react';

const About = () => {
  const milestones = [
    {
      year: "1999",
      title: "Fundação da ONG",
      description: "Iniciamos nossas atividades com um pequeno grupo de voluntários em São Paulo"
    },
    {
      year: "2005",
      title: "Primeiro Centro Educacional",
      description: "Inauguramos nosso primeiro centro educacional atendendo 50 crianças"
    },
    {
      year: "2010",
      title: "Expansão Nacional",
      description: "Expandimos para outros estados, chegando ao Rio de Janeiro e Minas Gerais"
    },
    {
      year: "2015",
      title: "Programa de Apadrinhamento",
      description: "Lançamos o programa de apadrinhamento, conectando padrinhos e crianças"
    },
    {
      year: "2020",
      title: "Adaptação Digital",
      description: "Implementamos ensino híbrido e acompanhamento digital durante a pandemia"
    },
    {
      year: "2024",
      title: "15.000 Crianças Atendidas",
      description: "Alcançamos a marca de 15.000 crianças atendidas em nossos programas"
    }
  ];

  const team = [
    {
      name: "Ana Carolina Silva",
      role: "Diretora Executiva",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop",
      description: "Pedagoga com 20 anos de experiência em projetos sociais"
    },
    {
      name: "Roberto Santos",
      role: "Coordenador de Projetos",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
      description: "Assistente social especializado em desenvolvimento comunitário"
    },
    {
      name: "Mariana Costa",
      role: "Coordenadora de Apadrinhamento",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      description: "Psicóloga com foco em desenvolvimento infantil"
    },
    {
      name: "Carlos Oliveira",
      role: "Diretor Financeiro",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      description: "Contador com experiência em gestão de ONGs"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-green-600">
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
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
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
              
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
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

      {/* Linha do Tempo */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center font-montserrat">
              Nossa Trajetória
            </h2>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex flex-col md:flex-row items-start md:items-center">
                  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8">
                    <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 font-nunito">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
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
                  <p className="text-blue-600 font-medium mb-2 font-nunito">
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
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-4" />
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
                <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-4" />
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
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
              Faça Parte da Nossa História
            </h2>
            <p className="text-xl mb-8 font-nunito opacity-90">
              Junte-se a nós nesta missão de transformar vidas e construir um futuro melhor para nossas crianças
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Link to="/apadrinhamento">
                  Apadrinhar Criança
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
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