import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { news } from '@/data/mockData';
import { Calendar, User, ArrowLeft, Share2, Heart, Facebook, Twitter, Linkedin } from 'lucide-react';

const NewsDetail = () => {
  const { id } = useParams();
  const article = news.find(item => item.id === parseInt(id || '0'));

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Notícia não encontrada</h1>
          <Button asChild>
            <Link to="/noticias">Voltar para Notícias</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const shareUrl = window.location.href;
  const shareTitle = article.title;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  // Conteúdo expandido da notícia
  const fullContent = `
    ${article.content}

    Esta iniciativa representa mais um passo importante em nossa missão de transformar vidas através de ações concretas e sustentáveis. Nosso compromisso é sempre buscar formas inovadoras de atender às necessidades das comunidades que servimos.

    "Estamos muito orgulhosos dos resultados alcançados e do impacto positivo que conseguimos gerar na vida das crianças e suas famílias", comenta ${article.author}, responsável pela coordenação do projeto.

    O sucesso desta ação só foi possível graças ao apoio incansável de nossos doadores, voluntários e parceiros. Cada contribuição, por menor que seja, faz uma diferença significativa em nossa capacidade de continuar este trabalho transformador.

    Para saber mais sobre como você pode contribuir com nossos projetos ou se tornar um voluntário, entre em contato conosco através dos nossos canais de comunicação. Juntos, podemos construir um futuro melhor para nossas crianças.

    Acompanhe nossas redes sociais para ficar por dentro de todas as novidades e ações da Missão Caiuá. Sua participação e engajamento são fundamentais para ampliarmos nosso impacto social.
  `;

  const relatedNews = news.filter(item => item.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb e Navegação */}
      <section className="py-6 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-700">
              <Link to="/noticias">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Notícias
              </Link>
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Compartilhar:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('facebook')}
                className="text-blue-600 hover:text-blue-700"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('twitter')}
                className="text-blue-400 hover:text-blue-500"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('linkedin')}
                className="text-blue-700 hover:text-blue-800"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Artigo Principal */}
      <article className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Cabeçalho do Artigo */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-montserrat leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 text-gray-500">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="font-nunito">{formatDate(article.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-nunito">{article.author}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-nunito">Curtir esta notícia</span>
                </div>
              </div>
            </header>

            {/* Imagem Principal */}
            <div className="mb-8">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Conteúdo */}
            <div className="prose prose-lg max-w-none font-nunito">
              <p className="text-xl text-gray-600 mb-6 leading-relaxed font-medium">
                {article.excerpt}
              </p>
              
              <div className="text-gray-700 leading-relaxed space-y-4">
                {fullContent.split('\n\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-4">
                      {paragraph.trim()}
                    </p>
                  )
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 mr-2">Tags:</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Projetos Sociais
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Educação
                </span>
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Comunidade
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Notícias Relacionadas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 font-montserrat">
              Outras Notícias
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  to={`/noticias/${relatedArticle.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-nunito line-clamp-2">
                      {relatedArticle.excerpt}
                    </p>
                    <div className="mt-3 text-xs text-gray-500">
                      {formatDate(relatedArticle.date)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
              Faça Parte da Nossa Missão
            </h2>
            <p className="text-xl mb-8 font-nunito opacity-90">
              Sua contribuição pode fazer a diferença na vida de uma criança
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Link to="/doacao">Fazer Doação</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/apadrinhamento">Apadrinhar Criança</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsDetail;