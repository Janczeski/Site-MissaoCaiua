import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL e Anon Key são obrigatórios. Configure no arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export interface NewsItem {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  image: string;
  content: string;
  author: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  coordinates: number[];
  image: string;
  raised: number;
  goal: number;
  created_at?: string;
  updated_at?: string;
}
