import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { SiteContentProvider, useSiteContent } from '@/content/SiteContentContext';
import { buildThemeCss } from '@/content/theme';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import Index from './pages/Index';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import HowToHelp from './pages/HowToHelp';
import Donation from './pages/Donation';
import Campaign from './pages/Campaign';
import Contact from './pages/Contact';
import Transparency from './pages/Transparency';
import NotFound from './pages/NotFound';

// O admin só é baixado por quem acessa /admin
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const queryClient = new QueryClient();

// Evita mostrar os textos padrão por um instante antes de carregar os textos editados
const PublicLayout = () => {
  const { loaded, content } = useSiteContent();
  if (!loaded) return <div className="min-h-screen bg-white" />;

  return (
    <div className="site-theme min-h-screen flex flex-col">
      {/* Cores editáveis no admin (Páginas → Cores) */}
      <style>{buildThemeCss(content.theme, '.site-theme')}</style>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quem-somos" element={<About />} />
          <Route path="/projetos" element={<Projects />} />
          <Route path="/projetos/:id" element={<ProjectDetail />} />
          <Route path="/noticias" element={<News />} />
          <Route path="/noticias/:id" element={<NewsDetail />} />
          <Route path="/como-ajudar" element={<HowToHelp />} />
          <Route path="/doacao" element={<Donation />} />
          <Route path="/campanhas/:uuid" element={<Campaign />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/transparencia" element={<Transparency />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SiteContentProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Rotas de Admin (sem Header/Footer) */}
              <Route path="/admin/login" element={<Suspense fallback={null}><AdminLogin /></Suspense>} />
              <Route path="/admin" element={<Suspense fallback={null}><AdminDashboard /></Suspense>} />
            
              {/* Rotas públicas (com Header/Footer) */}
              <Route path="*" element={<PublicLayout />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SiteContentProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;