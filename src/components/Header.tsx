import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Heart } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Quem Somos', href: '/quem-somos' },
    { name: 'Projetos', href: '/projetos' },
    { name: 'Notícias', href: '/noticias' },
    { name: 'Como Ajudar', href: '/como-ajudar' },
    { name: 'Contato', href: '/contato' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => window.scrollTo(0, 0)}>
            <Heart className="h-8 w-8" style={{ color: '#3b660a' }} />
            <span className="text-xl font-bold text-gray-900 font-montserrat">
              Missão Caiuá
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => window.scrollTo(0, 0)}
                className={`text-sm font-medium transition-colors font-nunito ${
                  isActive(item.href)
                    ? 'border-b-2 pb-1'
                    : 'text-gray-700'
                }`}
                style={isActive(item.href) ? { color: '#3b660a', borderColor: '#3b660a' } : {}}
                onMouseEnter={(e) => e.currentTarget.style.color = '#3b660a'}
                onMouseLeave={(e) => { if (!isActive(item.href)) e.currentTarget.style.color = ''; }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild style={{ backgroundColor: '#e8440d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}>
              <Link to="/doacao">Doar Agora</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <Heart className="h-6 w-6" style={{ color: '#3b660a' }} />
                  <span className="text-lg font-bold text-gray-900 font-montserrat">
                    Missão Caiuá
                  </span>
                </div>
              </div>
              
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => {
                      setIsOpen(false);
                      window.scrollTo(0, 0);
                    }}
                    className={`text-base font-medium transition-colors font-nunito py-2 ${
                      isActive(item.href) ? '' : 'text-gray-700'
                    }`}
                    style={isActive(item.href) ? { color: '#3b660a' } : {}}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#3b660a'}
                    onMouseLeave={(e) => { if (!isActive(item.href)) e.currentTarget.style.color = ''; }}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  <Button asChild className="w-full" style={{ backgroundColor: '#e8440d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d63c0b'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8440d'}>
                    <Link to="/doacao" onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}>
                      Doar Agora
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;