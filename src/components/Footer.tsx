import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import SmartLink from '@/components/SmartLink';
import { lines, useContent } from '@/content/SiteContentContext';
import { usePublicNews, usePublicProjects } from '@/hooks/use-public-data';

const Footer = () => {
  const footer = useContent('footer');
  const { siteName, nav } = useContent('global');
  const { data: news = [] } = usePublicNews();
  const { data: projects = [] } = usePublicProjects();

  const socials = [
    { url: footer.facebook, icon: Facebook, label: 'Facebook' },
    { url: footer.instagram, icon: Instagram, label: 'Instagram' },
    { url: footer.twitter, icon: Twitter, label: 'X / Twitter' },
    { url: footer.youtube, icon: Youtube, label: 'YouTube' },
  ].filter((s) => s.url.trim());

  const quickLinks = [
    { label: nav.about, to: '/quem-somos' },
    ...(projects.length ? [{ label: nav.projects, to: '/projetos' }] : []),
    ...(news.length ? [{ label: nav.news, to: '/noticias' }] : []),
    { label: nav.help, to: '/como-ajudar' },
    { label: nav.contact, to: '/contato' },
    { label: nav.transparency, to: '/transparencia' },
  ];

  return (
    <footer className="text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8" style={{ color: 'var(--c-accent)' }} />
              <span className="text-xl font-bold font-montserrat">{siteName}</span>
            </div>
            <p className="text-gray-300 font-nunito">{footer.description}</p>
            {socials.length > 0 && (
              <div className="flex space-x-4">
                {socials.map(({ url, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-gray-300 transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--c-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-montserrat">{footer.quickLinksTitle}</h3>
            <ul className="space-y-2 font-nunito">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gray-300 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Como Ajudar */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-montserrat">{footer.helpTitle}</h3>
            <ul className="space-y-2 font-nunito">
              {footer.helpLinks.map((item, index) => (
                <li key={index}>
                  <SmartLink to={item.link || '/como-ajudar'} className="text-gray-300 hover:text-white transition-colors">
                    {item.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-montserrat">{footer.contactTitle}</h3>
            <div className="space-y-3 font-nunito">
              {footer.address.trim() && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--c-secondary)' }} />
                  <span className="text-gray-300 text-sm">
                    {lines(footer.address).map((line, i) => (
                      <span key={i} className="block">{line}</span>
                    ))}
                  </span>
                </div>
              )}
              {footer.phone.trim() && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--c-secondary)' }} />
                  <span className="text-gray-300 text-sm">{footer.phone}</span>
                </div>
              )}
              {footer.email.trim() && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--c-secondary)' }} />
                  <a href={`mailto:${footer.email}`} className="text-gray-300 text-sm hover:text-white">
                    {footer.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Linha divisória e copyright */}
        <div className="mt-8 pt-8" style={{ borderTop: '1px solid var(--c-tertiary)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-nunito">{footer.copyright}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {footer.privacyLink.trim() && (
                <SmartLink to={footer.privacyLink} className="text-gray-400 hover:text-white text-sm transition-colors">
                  {footer.privacyLabel}
                </SmartLink>
              )}
              {footer.termsLink.trim() && (
                <SmartLink to={footer.termsLink} className="text-gray-400 hover:text-white text-sm transition-colors">
                  {footer.termsLabel}
                </SmartLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
