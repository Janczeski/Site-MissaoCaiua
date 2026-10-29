# Site Missão Caiuá — Admin e Infraestrutura

## Painel administrativo

Acesse `/admin/login` e entre com a senha definida na variável `ADMIN_PASSWORD` do servidor.
A senha não fica no código do site; a sessão expira em 12 horas.

| Aba | O que faz |
|---|---|
| **Páginas** | Edita todos os textos, imagens e links do site, página por página: carrossel da página inicial, equipe, linha do tempo, rodapé, menu, WhatsApp etc. Alterações só vão para o site ao clicar em **Salvar alterações**. **Restaurar padrão** volta aos textos originais. |
| **Notícias** | Cadastra notícias. Notícias desativadas ficam ocultas. Sem notícias ativas, a seção e o item de menu somem. |
| **Projetos** | Cadastra projetos (com meta de arrecadação opcional e link de doação). Mesma regra: sem projetos ativos, somem do site. |
| **Campanhas** | Campanhas de doação da Transforme.tech. Basta colar o código do widget: o site puxa o resto (veja abaixo). |
| **Transparência** | Envia PDFs com título, descrição, categoria e data. Aparecem em `/transparencia` (link em "Links Rápidos" no rodapé). |

### Conteúdo das notícias

O texto das notícias usa um formato simples (o editor tem botões para tudo):

| Escrever | Resultado |
|---|---|
| linha em branco | novo parágrafo |
| `## Título` | subtítulo |
| `- item` | lista |
| `**texto**` | negrito |
| `[texto](https://...)` | link |
| `![](/files/...)` | imagem (várias seguidas viram galeria; `.mp4` vira vídeo) |
| link do YouTube sozinho na linha | vídeo incorporado |

### Campanhas da Transforme.tech

1. Crie a campanha na Transforme.tech (título, descrições, banners, valores sugeridos).
2. Copie o código do widget da campanha (qualquer modo: `fullpage`, `modal` ou `embed`) ou o link do hotsite.
3. No admin, aba **Campanhas** → **Nova Campanha** → cole o código → **Buscar campanha** → **Adicionar ao site**.

O site monta sozinho a página `/campanhas/<número>` no visual do site e lista a campanha em
"Outras campanhas" na página Doação:

| Na Transforme.tech | No site |
|---|---|
| Título e descrição curta | Quadro colorido ao lado do formulário |
| Descrição completa | Seção "Sobre a campanha" (negrito, listas e links são mantidos) |
| Imagem de cadastro (PC e celular) | Banner no topo. GIF com vários slides vira carrossel: cada quadro parado por 1s ou mais é um slide |
| Banner de fundo | Fundo do topo quando não há imagem de cadastro |
| Valores sugeridos, mensal/única | Valores no quadro e "a partir de" no cartão |
| Arrecadado, doadores e meta | Mostrados se a campanha exibir a meta na Transforme |
| Campanha desativada | Some da lista; a página mostra "Campanha encerrada" |

Os dados são relidos da Transforme a cada 10 minutos (o botão de atualizar no admin força na hora).
As imagens são convertidas para WebP e guardadas no banco do site, então não dependem da Transforme para carregar.
O formulário de doação é sempre o da Transforme, em modo `embed`, dentro do layout do site.

**Cores do formulário:** o formulário roda no domínio da Transforme, e o site não consegue mudar o estilo de dentro
dele. Se os botões "Quero doar"/"Continuar" ficarem com texto preto sobre fundo escuro, cole no campo de CSS
personalizado da campanha, na Transforme:

```css
.widget-container { --landing-accent-text-on-accent: #ffffff; }
```

### Endereços do site antigo

Os endereços do WordPress antigo (notícias, páginas e arquivos em `/wp-content/uploads/...`)
redirecionam (301) para as páginas e arquivos equivalentes do site novo. A lista fica na tabela
`redirects` e pode ser ampliada via `POST /api/redirects` (admin) com `[{ "path": "/antigo", "target": "/novo" }]`.

### Idade da Missão

Em qualquer texto, `{anos}` vira a idade da Missão (fundada em 28/08/1928), calculada no fuso de
Dourados e atualizada sozinha a cada aniversário. `{ano}` vira o ano atual (usado no copyright).

## Arquitetura

- **Frontend**: React + Vite (`src/`). Textos padrão em `src/content/defaults.ts`; campos do admin em `src/content/schema.ts`.
- **API**: Node/Express (`server/index.js`). Cria as tabelas sozinha ao iniciar.
- **Banco**: PostgreSQL. Textos, notícias, projetos, documentos **e os arquivos enviados** (imagens e PDFs) ficam no banco —
  um backup do Postgres guarda tudo.

Em produção um único container serve a API e o site (`Dockerfile`), e injeta os textos no HTML para a página já abrir com o conteúdo certo.

## Rodando localmente

```bash
# Postgres local (uma vez)
docker run -d --name missaocaiua-pg -e POSTGRES_USER=missao -e POSTGRES_PASSWORD=missao_dev \
  -e POSTGRES_DB=missaocaiua -p 5434:5432 -v missaocaiua-pgdata:/var/lib/postgresql/data postgres:16-alpine

cp .env.example .env   # ajuste DATABASE_URL e ADMIN_PASSWORD

npm install
npm run server         # API em http://localhost:3051
npm run dev            # site em http://localhost:5173 (repassa /api e /files para a API)
```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Conexão com o Postgres |
| `ADMIN_PASSWORD` | Senha do painel `/admin` |
| `TOKEN_SECRET` | (opcional) Segredo das sessões do admin; trocar invalida todas as sessões |
| `PORT` | Porta do servidor (local 3051; no container 3000) |

## Deploy (Coolify)

Aplicação com build pack **Dockerfile**, porta **3000**, e um banco **PostgreSQL** do próprio Coolify no mesmo projeto.
Configure `DATABASE_URL` (URL interna do banco), `ADMIN_PASSWORD` e `TOKEN_SECRET`. Ative os backups do banco no Coolify.
