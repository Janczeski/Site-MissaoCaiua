import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import SiteLogo from '@/components/SiteLogo';
import { useContent } from '@/content/SiteContentContext';
import { usePublicNews, usePublicProjects } from '@/hooks/use-public-data';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const { siteName, nav } = useContent('global');
  const { data: news = [] } = usePublicNews();
  const { data: projects = [] } = usePublicProjects();

  // Projetos e Notícias só aparecem no menu quando há algo publicado
  const navigation = [
    { name: nav.home, href: '/' },
    { name: nav.about, href: '/quem-somos' },
    ...(projects.length ? [{ name: nav.projects, href: '/projetos' }] : []),
    ...(news.length ? [{ name: nav.news, href: '/noticias' }] : []),
    { name: nav.help, href: '/como-ajudar' },
    { name: nav.contact, href: '/contato' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center min-w-0 mr-4" onClick={() => window.scrollTo(0, 0)} aria-label={siteName}>
            <SiteLogo variant="header" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => window.scrollTo(0, 0)}
                className={`text-sm font-medium transition-colors font-nunito ${
                  isActive(item.href)
                    ? 'border-b-2 pb-1'
                    : 'text-gray-700'
                }`}
                style={isActive(item.href) ? { color: 'var(--c-primary)', borderColor: 'var(--c-primary)' } : {}}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--c-primary)'}
                onMouseLeave={(e) => { if (!isActive(item.href)) e.currentTarget.style.color = ''; }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild style={{ backgroundColor: 'var(--c-accent)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent)'}>
              <Link to="/doacao">{nav.donate}</Link>
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
                <SiteLogo variant="mobile" />
              </div>
              
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => {
                      setIsOpen(false);
                      window.scrollTo(0, 0);
                    }}
                    className={`text-base font-medium transition-colors font-nunito py-2 ${
                      isActive(item.href) ? '' : 'text-gray-700'
                    }`}
                    style={isActive(item.href) ? { color: 'var(--c-primary)' } : {}}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--c-primary)'}
                    onMouseLeave={(e) => { if (!isActive(item.href)) e.currentTarget.style.color = ''; }}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  <Button asChild className="w-full" style={{ backgroundColor: 'var(--c-accent)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-accent)'}>
                    <Link to="/doacao" onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}>
                      {nav.donate}
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