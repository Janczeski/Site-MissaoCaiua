import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold font-montserrat">Missão Caiuá</span>
            </div>
            <p className="text-gray-300 font-nunito">
              Transformando vidas através da educação, saúde e desenvolvimento comunitário. 
              Juntos construímos um futuro melhor para nossas crianças.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
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
                <Link to="/apadrinhamento" className="text-gray-300 hover:text-white transition-colors">
                  Apadrinhamento
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
                <Link to="/doacao" className="text-gray-300 hover:text-white transition-colors">
                  Fazer Doação
                </Link>
              </li>
              <li>
                <Link to="/apadrinhamento" className="text-gray-300 hover:text-white transition-colors">
                  Apadrinhar Criança
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Seja Voluntário
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Parcerias
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
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Rua das Flores, 123<br />
                  Centro, São Paulo - SP<br />
                  CEP: 01234-567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">(11) 1234-5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">contato@esperancaviva.org.br</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória e copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-nunito">
              © 2024 Missão Caiuá. Todos os direitos reservados.
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