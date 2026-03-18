import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="text-white" style={{ backgroundColor: '#2f4240' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8" style={{ color: '#e8440d' }} />
              <span className="text-xl font-bold font-montserrat">Missão Caiuá</span>
            </div>
            <p className="text-gray-300 font-nunito">
              Servindo os povos indígenas de Dourados e região desde 1928. 
              Evangelização, saúde e assistência social com amor e respeito à cultura indígena.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = '#81a425'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = '#81a425'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = '#81a425'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = '#81a425'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-montserrat">Links Rápidos</h3>
            <ul className="space-y-2 font-nunito">
              <li>
                <Link to="/quem-somos" className="text-gray-300 hover:text-white transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link to="/projetos" className="text-gray-300 hover:text-white transition-colors">
                  Nossos Projetos
                </Link>
              </li>
              <li>
                <Link to="/noticias" className="text-gray-300 hover:text-white transition-colors">
                  Notícias
                </Link>
              </li>
              <li>
                <Link to="/como-ajudar" className="text-gray-300 hover:text-white transition-colors">
                  Como Ajudar
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-300 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Como Ajudar */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-montserrat">Como Ajudar</h3>
            <ul className="space-y-2 font-nunito">
              <li>
                <Link to="/como-ajudar" className="text-gray-300 hover:text-white transition-colors">
                  Fazer Doação
                </Link>
              </li>
              <li>
                <Link to="/como-ajudar" className="text-gray-300 hover:text-white transition-colors">
                  Seja Voluntário
                </Link>
              </li>
              <li>
                <Link to="/como-ajudar" className="text-gray-300 hover:text-white transition-colors">
                  Parcerias Empresariais
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Nossos Projetos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Transparência
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-montserrat">Contato</h3>
            <div className="space-y-3 font-nunito">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: '#81a425' }} />
                <span className="text-gray-300 text-sm">
                  Av. Marcelino Pires, 1234<br />
                  Dourados - MS<br />
                  CEP: 79800-000
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: '#81a425' }} />
                <span className="text-gray-300 text-sm">(67) 3421-0000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: '#81a425' }} />
                <span className="text-gray-300 text-sm">contato@missaocaiua.org.br</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória e copyright */}
        <div className="mt-8 pt-8" style={{ borderTop: '1px solid #47623d' }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-nunito">
              © 2024 Missão Evangélica Caiuá. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;