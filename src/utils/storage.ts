// Funções para gerenciar dados no localStorage

export interface NewsItem {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  image: string;
  content: string;
  author: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  coordinates: [number, number];
  image: string;
  raised: number;
  goal: number;
}

// Notícias
export function getNews(): NewsItem[] {
  const stored = localStorage.getItem('missao_news');
  return stored ? JSON.parse(stored) : [];
}

export function saveNews(news: NewsItem[]): void {
  localStorage.setItem('missao_news', JSON.stringify(news));
}

export function addNews(news: Omit<NewsItem, 'id'>): NewsItem {
  const allNews = getNews();
  const newItem = {
    ...news,
    id: allNews.length > 0 ? Math.max(...allNews.map(n => n.id)) + 1 : 1
  };
  saveNews([...allNews, newItem]);
  return newItem;
}

export function updateNews(id: number, updates: Partial<NewsItem>): void {
  const allNews = getNews();
  const index = allNews.findIndex(n => n.id === id);
  if (index !== -1) {
    allNews[index] = { ...allNews[index], ...updates };
    saveNews(allNews);
  }
}

export function deleteNews(id: number): void {
  const allNews = getNews();
  saveNews(allNews.filter(n => n.id !== id));
}

// Projetos
export function getProjects(): ProjectItem[] {
  const stored = localStorage.getItem('missao_projects');
  return stored ? JSON.parse(stored) : [];
}

export function saveProjects(projects: ProjectItem[]): void {
  localStorage.setItem('missao_projects', JSON.stringify(projects));
}

export function addProject(project: Omit<ProjectItem, 'id'>): ProjectItem {
  const allProjects = getProjects();
  const newItem = {
    ...project,
    id: allProjects.length > 0 ? Math.max(...allProjects.map(p => p.id)) + 1 : 1
  };
  saveProjects([...allProjects, newItem]);
  return newItem;
}

export function updateProject(id: number, updates: Partial<ProjectItem>): void {
  const allProjects = getProjects();
  const index = allProjects.findIndex(p => p.id === id);
  if (index !== -1) {
    allProjects[index] = { ...allProjects[index], ...updates };
    saveProjects(allProjects);
  }
}

export function deleteProject(id: number): void {
  const allProjects = getProjects();
  saveProjects(allProjects.filter(p => p.id !== id));
}

// Inicializar com dados padrão se não existir
export function initializeDefaultData(defaultNews: NewsItem[], defaultProjects: ProjectItem[]): void {
  if (!localStorage.getItem('missao_news')) {
    saveNews(defaultNews);
  }
  if (!localStorage.getItem('missao_projects')) {
    saveProjects(defaultProjects);
  }
}
