// Categorias usadas no cadastro de notícias (valor salvo → rótulo exibido)
export const NEWS_CATEGORIES: Record<string, string> = {
  'saúde': 'Saúde',
  'evangelização': 'Evangelização',
  'assistência': 'Assistência Social',
  'educação': 'Educação',
  'geral': 'Geral',
};

export const newsCategoryLabel = (value: string) =>
  NEWS_CATEGORIES[value] || value.charAt(0).toUpperCase() + value.slice(1);
