import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/content/SiteContentContext';
import { usePublicDocuments } from '@/hooks/use-public-data';
import { formatDate, formatSize } from '@/lib/format';
import { FileText, ExternalLink, Calendar } from 'lucide-react';

const Transparency = () => {
  const t = useContent('transparency');
  const { data: documents = [], isLoading } = usePublicDocuments();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = Array.from(new Set(documents.map((d) => d.category).filter(Boolean)));
  const filtered = selectedCategory === 'all'
    ? documents
    : documents.filter((d) => d.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 site-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">{t.heroTitle}</h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90">{t.heroSubtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {t.intro && (
              <p className="text-lg text-gray-600 mb-10 font-nunito text-center whitespace-pre-line">{t.intro}</p>
            )}

            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {['all', ...categories].map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? t.allCategories : category}
                  </Button>
                ))}
              </div>
            )}

            {!isLoading && filtered.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 font-nunito">{t.emptyText}</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {filtered.map((doc) => (
                  <li key={doc.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-5"
                    >
                      <div className="flex-shrink-0 rounded-lg p-3 self-start" style={{ backgroundColor: 'color-mix(in srgb, var(--c-accent) 8%, transparent)' }}>
                        <FileText className="h-7 w-7" style={{ color: 'var(--c-accent)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 font-montserrat break-words">{doc.title}</h2>
                        {doc.description && (
                          <p className="text-gray-600 text-sm font-nunito mt-1 whitespace-pre-line">{doc.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                          <span className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {formatDate(doc.date)}
                          </span>
                          {doc.category && <span>{doc.category}</span>}
                          {doc.file_size > 0 && <span>PDF · {formatSize(doc.file_size)}</span>}
                        </div>
                      </div>
                      <span
                        className="inline-flex items-center justify-center text-sm font-medium rounded-md px-4 py-2 text-white flex-shrink-0"
                        style={{ backgroundColor: 'var(--c-primary)' }}
                      >
                        {doc.file_url.startsWith('/files/') ? t.openButton : t.openLinkButton}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Transparency;
