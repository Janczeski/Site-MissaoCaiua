import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContent } from '@/content/SiteContentContext';

export default function NotFoundPage() {
  const { notFound: t } = useContent('global');

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-green-50 p-6 text-center">
      <div className="space-y-6 max-w-md">
        <div className="space-y-3">
          <h1 className="text-8xl font-bold" style={{ color: '#3b660a' }}>404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">{t.title}</h2>
          <p className="text-muted-foreground">{t.text}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">{t.homeButton}</Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            {t.backButton}
          </Button>
        </div>
      </div>
    </div>
  );
}
