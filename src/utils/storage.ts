// Funções para gerenciar dados no Supabase
import { supabase, type NewsItem, type ProjectItem } from '@/lib/supabase';

// ==================== NOTÍCIAS ====================

export async function getNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
  
  return data || [];
}

export async function addNews(news: Omit<NewsItem, 'id'>): Promise<NewsItem | null> {
  const { data, error } = await supabase
    .from('news')
    .insert([news])
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao adicionar notícia:', error);
    throw error;
  }
  
  return data;
}

export async function updateNews(id: number, updates: Partial<NewsItem>): Promise<void> {
  const { error } = await supabase
    .from('news')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  
  if (error) {
    console.error('Erro ao atualizar notícia:', error);
    throw error;
  }
}

export async function deleteNews(id: number): Promise<void> {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Erro ao deletar notícia:', error);
    throw error;
  }
}

// ==================== PROJETOS ====================

export async function getProjects(): Promise<ProjectItem[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar projetos:', error);
    return [];
  }
  
  return data || [];
}

export async function addProject(project: Omit<ProjectItem, 'id'>): Promise<ProjectItem | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao adicionar projeto:', error);
    throw error;
  }
  
  return data;
}

export async function updateProject(id: number, updates: Partial<ProjectItem>): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  
  if (error) {
    console.error('Erro ao atualizar projeto:', error);
    throw error;
  }
}

export async function deleteProject(id: number): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Erro ao deletar projeto:', error);
    throw error;
  }
}

// ==================== UPLOAD DE IMAGENS ====================

export async function uploadImage(file: File, folder: 'news' | 'projects'): Promise<string> {
  // Gerar nome único para o arquivo
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Erro ao fazer upload:', error);
    throw error;
  }
  
  // Obter URL pública da imagem
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(data.path);
  
  return publicUrl;
}

export { type NewsItem, type ProjectItem };
