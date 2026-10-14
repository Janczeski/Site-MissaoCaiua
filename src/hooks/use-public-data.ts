import { useQuery } from '@tanstack/react-query';
import { documentsApi, newsApi, projectsApi } from '@/lib/api';

// Listas públicas (só itens ativos), compartilhadas entre header, rodapé e páginas
const options = { staleTime: 60_000, retry: 1 };

export const usePublicNews = () =>
  useQuery({ queryKey: ['public', 'news'], queryFn: () => newsApi.list(), ...options });

export const usePublicProjects = () =>
  useQuery({ queryKey: ['public', 'projects'], queryFn: () => projectsApi.list(), ...options });

export const usePublicDocuments = () =>
  useQuery({ queryKey: ['public', 'documents'], queryFn: () => documentsApi.list(), ...options });
