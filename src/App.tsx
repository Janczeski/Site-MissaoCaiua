import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import Index from './pages/Index';
import About from './pages/About';
import Projects from './pages/Projects';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import HowToHelp from './pages/HowToHelp';
import Donation from './pages/Donation';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Rotas de Admin (sem Header/Footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Rotas públicas (com Header/Footer) */}
            <Route path="*" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/quem-somos" element={<About />} />
                    <Route path="/projetos" element={<Projects />} />
                    <Route path="/noticias" element={<News />} />
                    <Route path="/noticias/:id" element={<NewsDetail />} />
                    <Route path="/como-ajudar" element={<HowToHelp />} />
                    <Route path="/doacao" element={<Donation />} />
                    <Route path="/contato" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;