// Rotas em que o Pixel da Meta pode registrar PageView (só PageView; nenhum outro evento).
//
// Só vale com META_PIXEL_ENABLED=true no servidor (hoje false): sem isso nada carrega.
// Lembre que o SDK da Meta pode enviar a URL completa (com ?parâmetros), o referrer e outros
// metadados da página.
//
// Proposta revisada: páginas institucionais cuja URL e conteúdo não revelam saúde, religião
// ou etnia de quem visita. NÃO liberar sem nova revisão (ver ADMIN_README.md, "Rotas"):
// - '/projetos'       → ?filtro=<categoria> na URL (ex.: Saúde Indígena, Evangelização);
// - '/projetos/:id'   → projeto 1 é o Hospital (saúde); os demais, evangelização (religião);
// - '/noticias/:id'   → notícias de saúde/pacientes/aldeias; cada notícia nova entraria sem revisão.
// - '/politica-de-privacidade' → nunca: quem lê a política não deve ser rastreado por ela
//   (o texto da página lista estas rotas; mudou a lista, revise a política).
// Campanhas entram uma a uma, pelo caminho exato: uma campanha nova não é liberada sozinha.
//
// Formato: caminho exato ('/doacao') ou com parâmetros de um segmento ('/campanhas/:uuid').
// Rotas do admin nunca são rastreadas, mesmo que apareçam aqui. Páginas inexistentes caem no
// NotFound e não estão na lista.
export const META_PIXEL_ALLOWED_PATHS: readonly string[] = [
  '/',
  '/quem-somos',
  '/como-ajudar',
  '/doacao',
  '/campanhas/2363', // "Apoie a Missão Caiuá"
  '/noticias',
  '/transparencia',
  '/contato',
];

const decode = (pathname: string) => {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
};

// O React Router decodifica o caminho antes de comparar rotas (/%61dmin abre o admin)
const normalize = (pathname: string) => {
  const lower = decode(pathname).toLowerCase();
  return lower.length > 1 ? lower.replace(/\/+$/, '') : lower;
};

/** O React Router não diferencia maiúsculas: /Admin também abre o admin. */
export function isAdminPath(pathname: string): boolean {
  const path = normalize(pathname);
  return path === '/admin' || path.startsWith('/admin/');
}

export function matchesPath(pathname: string, pattern: string): boolean {
  const path = normalize(pathname).split('/');
  const expected = normalize(pattern).split('/');
  if (path.length !== expected.length) return false;
  return expected.every((segment, i) => (segment.startsWith(':') ? path[i] !== '' : segment === path[i]));
}

export function isTrackablePath(pathname: string, allowed: readonly string[] = META_PIXEL_ALLOWED_PATHS): boolean {
  if (isAdminPath(pathname)) return false;
  return allowed.some((pattern) => matchesPath(pathname, pattern));
}
