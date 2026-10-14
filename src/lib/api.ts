// Cliente da API do site (server/index.js)

const TOKEN_KEY = 'adminToken';

export interface NewsItem {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  image: string;
  content: string;
  author: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
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
  donation_link: string;
  show_goal: boolean;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentItem {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  file_url: string;
  file_name: string;
  file_size: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string | null) => {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // sessionStorage indisponível (modo privado etc.)
  }
};

async function request<T>(path: string, init: RequestInit = {}, auth = true): Promise<T> {
  const headers = new Headers(init.headers);
  const token = auth ? getToken() : null;
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');

  const res = await fetch(path, { ...init, headers });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && token) {
      setToken(null);
      window.dispatchEvent(new Event('admin-session-expired'));
    }
    throw new Error(data?.error || `Erro ${res.status}`);
  }
  return data as T;
}

const json = (body: unknown) => JSON.stringify(body);

// ==================== AUTENTICAÇÃO ====================

export const login = (password: string) =>
  request<{ token: string }>('/api/login', { method: 'POST', body: json({ password }) });

export const checkSession = () => request<{ valid: boolean }>('/api/session');

// ==================== CONTEÚDO ====================

export const getContent = () => request<Record<string, unknown>>('/api/content', {}, false);

export const saveContent = (key: string, value: unknown) =>
  request<{ ok: true }>(`/api/content/${key}`, { method: 'PUT', body: json(value) });

// ==================== CRUD ====================

function crud<T extends { id: number }>(table: string) {
  return {
    // Sem token a API devolve só os itens ativos; o admin passa admin=true para ver todos
    list: (admin = false) => request<T[]>(`/api/${table}`, {}, admin),
    get: (id: number | string, admin = false) => request<T>(`/api/${table}/${id}`, {}, admin),
    create: (item: Omit<T, 'id'>) => request<T>(`/api/${table}`, { method: 'POST', body: json(item) }),
    update: (id: number, item: Partial<T>) => request<T>(`/api/${table}/${id}`, { method: 'PUT', body: json(item) }),
    remove: (id: number) => request<{ ok: true }>(`/api/${table}/${id}`, { method: 'DELETE' }),
  };
}

export const newsApi = crud<NewsItem>('news');
export const projectsApi = crud<ProjectItem>('projects');
export const documentsApi = crud<DocumentItem>('documents');

// ==================== ARQUIVOS ====================

export async function uploadFile(file: File) {
  const body = new FormData();
  body.append('file', file);
  return request<{ url: string; name: string; size: number }>('/api/upload', { method: 'POST', body });
}
