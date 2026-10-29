import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, FolderKanban, HeartHandshake, LayoutTemplate, Loader2, LogOut, Newspaper } from 'lucide-react';
import ContentEditor from '@/components/admin/ContentEditor';
import NewsManager from '@/components/admin/NewsManager';
import ProjectsManager from '@/components/admin/ProjectsManager';
import DocumentsManager from '@/components/admin/DocumentsManager';
import CampaignsManager from '@/components/admin/CampaignsManager';

const AdminDashboard = () => {
  const { isAuthenticated, isChecking, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isChecking, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-montserrat" style={{ color: '#3b660a' }}>
                Painel Administrativo
              </h1>
              <p className="text-sm text-gray-600 font-nunito">
                Missão Evangélica Caiuá
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="hidden sm:flex items-center gap-2">
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Ver site
                </a>
              </Button>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pages" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-2 sm:grid-cols-5 h-auto">
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Páginas
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              Notícias
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              Projetos
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <HeartHandshake className="h-4 w-4" />
              Campanhas
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Transparência
            </TabsTrigger>
          </TabsList>

          {/* forceMount mantém alterações não salvas ao trocar de aba */}
          <TabsContent value="pages" forceMount className="data-[state=inactive]:hidden">
            <ContentEditor />
          </TabsContent>

          <TabsContent value="news">
            <NewsManager />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignsManager />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
