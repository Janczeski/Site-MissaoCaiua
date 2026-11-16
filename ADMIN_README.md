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
| `CANONICAL_HOST` / `REDIRECT_HOSTS` | Domínio principal e domínios que redirecionam para ele |
| `META_PIXEL_ENABLED` | `true` libera o Pixel da Meta (padrão: desativado). Veja "Pixel da Meta e consentimento" |
| `META_PIXEL_ID` | ID do conjunto de dados da Meta (público; não é segredo) |

## Pixel da Meta e consentimento

O pixel fica **desativado**. Ele só é carregado quando **todas** as condições valem:

1. `META_PIXEL_ENABLED=true` e `META_PIXEL_ID` válido no servidor;
2. a página foi pedida pelo domínio `CANONICAL_HOST` (o cabeçalho `Host`, não `X-Forwarded-Host`).
   localhost, a URL temporária `*.sslip.io` e outros domínios nunca recebem o pixel;
3. a rota está em `META_PIXEL_ALLOWED_PATHS` (`src/lib/tracking/routes.ts`) (lista em "Rotas propostas" abaixo);
4. o visitante clicou em **Aceitar marketing** no banner.

`META_PIXEL_ALLOWED_PATHS` **não é variável de ambiente**: é uma lista no código, e mudar exige novo deploy
(de propósito, para que cada rota seja revisada antes). Formato:

```ts
export const META_PIXEL_ALLOWED_PATHS: readonly string[] = ['/doacao', '/campanhas/:uuid'];
```

- caminho exato (`'/doacao'`) ou com parâmetro de **um** segmento (`'/campanhas/:uuid'`); sem curingas;
- maiúsculas/minúsculas e barra final são ignoradas; `?parâmetros` e `#âncora` não entram na comparação
  (mas o SDK da Meta pode enviar a URL completa);
- rotas do `/admin` nunca são rastreadas, mesmo se listadas;
- **lista vazia**: o pixel nunca carrega, mesmo com a flag ligada, e o banner não aparece.

Sem rota liberada, o banner e o link "Preferências de cookies" do rodapé nem aparecem (não há o que consentir).
Em `npm run dev`, `/?previewConsent` mostra o banner para revisão visual, sem carregar o pixel.

- A escolha fica no `localStorage` (`missaocaiua:consent`) com versão e data. Se o navegador não deixar
  ler ou salvar, o pixel não carrega. Mudar `CONSENT_VERSION` em `src/lib/tracking/consent.ts` pede a escolha de novo.
- Recusar depois de aceitar: o envio para na hora, o SDK recebe `consent revoke`, os cookies `_fbp`/`_fbc`
  são apagados e a página recarrega (sem o SDK). Vale também para outras abas abertas.
  Isso não apaga dados que já foram enviados à Meta.
- Um PageView por página visitada (voltar/avançar contam). O código envia só o **primeiro** PageView de cada
  documento; os das navegações internas seguintes saem do rastreador de histórico do próprio SDK
  (`pushState`/`replaceState`/`popstate`), porque o SDK **descarta** qualquer `fbq('track', 'PageView')`
  repetido no mesmo documento. Por isso `disablePushState` **não** é usado. O SDK compara o endereço completo:
  hoje nenhuma página liberada muda só `#` ou `?parâmetro` pelo histórico (`/projetos?filtro=` não é liberada).
  Correspondência avançada e configuração automática ficam desligadas no código. Não há fallback `<noscript>`.
- **Restrição da Meta (verificada em 16/11/2026):** a configuração que a Meta entrega para este pixel
  (`connect.facebook.net/signals/config/<id>`) ativa `ProtectedDataMode`. Com ele o SDK reduz `dl` e `rl` à
  origem (`https://missaocaiua.org.br`, sem caminho) e marca o envio com `pm=1`. O código do site chama apenas
  `fbq('track', 'PageView')`, sem URL. Consequência: na Meta todos os PageViews aparecem como a página inicial
  e **não é possível contar visualizações por página** enquanto essa restrição valer. É uma decisão da Meta
  (ligada à categoria do conjunto de dados): não contorne com eventos personalizados, parâmetros ou `?query`.
- **A lista limita o SDK inteiro, não só os nossos PageViews.** O SDK só é carregado num documento cuja rota
  está liberada. Com ele carregado, qualquer ida a uma rota não liberada (inclusive `/admin`) abre um
  **documento novo**, que não carrega o SDK, antes de o endereço mudar no documento atual: cliques em links,
  `pushState`/`replaceState` (navegação programática) e voltar/avançar (`popstate`) são interceptados
  (`navigationGuard.ts`). Não dependemos de `disablePushState` para isso. Página restaurada do cache de
  voltar/avançar com o SDK é recarregada. Consequência: com poucas rotas liberadas, sair delas recarrega a página.
- A escolha é relida a cada navegação e ao voltar para a aba; se o aceite sumiu (dados do site apagados) ou não
  pode mais ser lido, vale como sem consentimento.
- Revogar antes de o `fbevents.js` executar descarta a fila (init/PageView) em vez de enviá-la.
- Se já houver um `fbq` que não é deste módulo (ex.: código colado no admin), o pixel deste módulo não carrega e
  a recusa **não** mexe nesse `fbq` nem nos cookies `_fbp`/`_fbc`: o consentimento daqui não o controla.

**Fora do controle deste mecanismo:** códigos colados no admin (campo "Código do widget" da página Doação,
renderizado pelo `EmbedHtml`) rodam scripts sem passar pelo consentimento; o formulário da Transforme.tech roda em
iframe de outro domínio, com rastreamento próprio configurado lá; e ferramentas do Cloudflare (Zaraz, Web Analytics)
são injetadas fora do código do site. Esta seção não impede tecnicamente nenhum desses casos: cada um precisa ser
verificado na sua origem. Não cole código de pixel nesses campos.

Testes: `npm test` (Node, sem rede, SDK simulado). **A integração não foi validada com o SDK real da Meta.**

### Roteiro de ativação do Pixel (ainda não executado)

Estado atual: `META_PIXEL_ENABLED=false` (nada carrega), lista de rotas proposta no código, só `PageView` (sem
eventos de doação/compra, personalizados, correspondência avançada ou API de Conversões). Só siga este roteiro
depois de resolver as pendências do passo 3 e com autorização formal para ativar.

**1. Variáveis no Coolify** (aplicação `missaocaiua-site` → Environment Variables; marque como variável de
execução, **não** "Build Variable"):

| Variável | Valor | Observação |
|---|---|---|
| `CANONICAL_HOST` | `missaocaiua.org.br` | Já existe (usada nos redirecionamentos). Sem `https://`, sem barra, minúsculas |
| `META_PIXEL_ID` | `1494309866239727` | Só dígitos, sem espaços. Confirme com a agência que é o conjunto de dados certo |
| `META_PIXEL_ENABLED` | `true` | Texto exato. Qualquer outro valor (`True`, `1`, `sim`) = desativado |

As variáveis são lidas **só quando o servidor inicia**. Depois de salvar, use **Redeploy** (ou **Restart**, se
a sua versão do Coolify recriar o container com as variáveis novas). Para confirmar, procure no log da aplicação a
linha `Pixel da Meta habilitado somente em missaocaiua.org.br ...`. Se aparecer `Pixel da Meta desativado`, a
configuração não foi aplicada ou tem algum valor inválido.

**2. Rotas propostas** (`META_PIXEL_ALLOWED_PATHS` em `src/lib/tracking/routes.ts`; mudar exige commit e
**novo deploy**). Revisadas em 16/11/2026 com o conteúdo de produção:

| Liberada | Página | Observação |
|---|---|---|
| `/` | Início | Tem campo de newsletter (envio simulado, nada vai para a URL) |
| `/quem-somos` | Quem somos | Institucional |
| `/como-ajudar` | Como ajudar | Formulário de voluntário (envio simulado, nada vai para a URL) |
| `/doacao` | Doação | O widget da Transforme roda em iframe próprio; não foi alterado |
| `/campanhas/2363` | Campanha "Apoie a Missão Caiuá" | Caminho exato: campanhas novas **não** entram sozinhas |
| `/noticias` | Lista de notícias | Só a lista; a URL não traz o assunto |
| `/transparencia` | Transparência | PDFs abrem fora do site e não geram PageView |
| `/contato` | Contato | Formulário (envio simulado, nada vai para a URL) |

**Não liberar sem nova revisão** (URL ou conteúdo podem indicar saúde, religião ou etnia de quem visita):

| Página | Motivo |
|---|---|
| `/projetos` | `?filtro=<categoria>` vai na URL (ex.: `Saúde Indígena`, `Evangelização`) |
| `/projetos/:id` | `/projetos/1` é o Hospital e Maternidade Porta da Esperança (saúde); 2 e 3 são de evangelização |
| `/noticias/:id` | 85 notícias, 31 de saúde (hospital, pacientes, DSEI, aldeias), 13 de evangelização; cada notícia nova entraria sem revisão |

**Excluídas por construção:** `/admin` e `/admin/login` (nunca rastreadas, mesmo se listadas), `/api/*` (JSON,
sem página), páginas inexistentes (caem no NotFound e não estão na lista), redirecionamentos do site antigo
(respondem 301 no servidor) e campanhas não listadas.
Consequência prática: com o pixel carregado, ir de uma página liberada para uma não liberada (ex.: abrir uma
notícia) recarrega a página inteira.

**3. Pendências externas (antes de ativar):**
- **Deploy do código:** em 16/11/2026 a produção ainda não tem o código de rastreamento (o HTML não traz
  `window.__SITE_CONFIG__`). Ele precisa ir para produção com `META_PIXEL_ENABLED=false` antes de qualquer
  ativação.
- **Política de privacidade: MINUTA, pendente de revisão da instituição.** Página `/politica-de-privacidade`
  (`src/pages/PrivacyPolicy.tsx`, texto no código; mudar exige deploy). O link do rodapé e do banner usa o campo
  "Link da política de privacidade" (admin → Rodapé), cujo padrão agora é `/politica-de-privacidade`; em
  16/11/2026 a produção não tinha esse campo salvo, então o padrão vale sem alterar o banco. A página **não** é
  rastreada (fora de `META_PIXEL_ALLOWED_PATHS`) e lista as rotas liberadas a partir dessa constante: ao mudar a
  lista, revise o texto. O texto deve bater com o banner; se o banner mudar, aumente `CONSENT_VERSION`.
- **Agência:** confirmar o ID do conjunto de dados, quem tem acesso, quais rotas/eventos ela precisa e garantir
  que ela **não** instale outro pixel (código colado no admin, GTM, Zaraz) e não ative "Configuração automática"
  ou "Correspondência avançada automática" no Gerenciador de Eventos.
- **Transforme.tech:** confirmar se o formulário de doação (iframe) tem pixel próprio configurado lá e com qual
  ID. Esse rastreamento não passa pelo nosso consentimento.
- **Cloudflare:** confirmar que Zaraz e qualquer ferramenta que injeta scripts estão desligadas para o domínio
  e que nenhuma regra de cache guarda o HTML (o servidor manda `no-cache`; o HTML muda conforme o domínio).

**4. Teste com o SDK real** (só depois da autorização; janela anônima, DevTools → Rede filtrada por
`facebook`, e **Eventos de teste** do Gerenciador de Eventos aberto ao mesmo tempo):
1. **Sem escolha:** abra `/`. O banner aparece e **nenhuma** requisição a `connect.facebook.net` ou
   `facebook.com/tr` acontece. `window.fbq` é `undefined`.
2. **Recusa:** recuse e percorra várias páginas. Nenhuma requisição, nenhum cookie `_fbp`/`_fbc`.
3. **Aceite:** em janela nova, aceite em `/`. Um único `fbevents.js` e **um** `PageView` (`ev=PageView`).
4. **Uma visita por navegação:** percorra `/` → `/quem-somos` → `/doacao` → `/campanhas/2363` → `/noticias` →
   `/transparencia` → `/contato`. Exatamente um PageView em cada uma. Recarregar = mais um. Mudar só `#` ou
   `?parâmetro` na mesma página = nenhum a mais. Voltar/avançar = um por página.
5. **Não liberadas:** de `/noticias`, abra uma notícia; de `/`, abra `/projetos` e `/projetos/1`. A página
   recarrega e, a partir daí, nenhuma requisição à Meta. Ao voltar para uma liberada, um PageView novo.
   Teste também `/pagina-que-nao-existe` e `/campanhas/9999`: nenhuma requisição.
6. **Admin:** com aceite, abra `/admin` (digitando o endereço e pelo voltar/avançar). Documento novo, sem
   `fbevents.js`, sem requisições, e `window.__SITE_CONFIG__.metaPixel === null`.
7. **Revogação:** com aceite, "Preferências de cookies" no rodapé → recusar. A página recarrega, `_fbp`/`_fbc`
   somem, nenhuma requisição depois. Repita com duas abas abertas: a outra também para.
8. **URLs e metadados enviados:** em cada `facebook.com/tr`, anote `dl` (URL completa, com `?parâmetros`),
   `rl` (referrer: pode ser a página anterior ou o site de origem), `ev`, `id` e demais parâmetros. Não pode
   haver `ud[...]` nem `cd[...]`. Em `/contato` e `/como-ajudar`, preencha o formulário **com dados fictícios**
   antes de navegar e confirme que nada dele aparece. Entre também por um link com `?utm_...` e `?fbclid=...`.
9. **Restrições da Meta:** em **Eventos de teste** e no detalhe do `PageView`, confira, para **cada** página
   acima, se o caminho da URL chega inteiro ou se a Meta o restringe/remove (o conjunto de dados está na
   categoria Religião). Veja **Diagnóstico** (duplicidade, dados sensíveis, restrições). Anote o resultado por
   página. Se a Meta restringir, **aceite a restrição**: não renomeie eventos, não crie eventos personalizados e
   não mova o caminho para `?parâmetros` para contornar. Resultado em 16/11/2026: restringe — `dl` chega só
   com a origem e `pm=1` em todas as páginas (ver "Restrição da Meta" acima).

Registre o resultado de cada item (data, navegador, prints). Só depois disso considere a integração validada.

**5. Desativar de novo:** no Coolify, troque `META_PIXEL_ENABLED` para `false` (ou apague a variável) e use
**Redeploy**/**Restart** (sem build novo; o servidor só lê a variável ao iniciar). Confira no log
`Pixel da Meta desativado` e, no site, `window.__SITE_CONFIG__.metaPixel === null`. O banner e o link de
preferências somem. Para remover também as rotas, esvazie a lista em `routes.ts` (exige commit e deploy).
Cookies `_fbp`/`_fbc` que já estão nos navegadores dos visitantes não são apagados por esse procedimento.

**6. Interrompa a ativação (volte ao passo 5) se:**
- houver **duplicidade**: mais de um `fbevents.js`, mais de um `init`, mais de um PageView por página ou um
  segundo ID de pixel nas requisições;
- houver **envio fora das rotas liberadas**: qualquer requisição à Meta sem aceite, depois da recusa, em rota não
  liberada, no `/admin`, na URL `*.sslip.io` ou em domínio diferente do `CANONICAL_HOST`;
- houver **dados inadequados**: `ud[...]`, dados personalizados, e-mail/nome/telefone/CPF na URL ou no referrer,
  conteúdo religioso ou de saúde identificável, ou alertas de dados sensíveis no Diagnóstico.

## Deploy (Coolify)

Aplicação com build pack **Dockerfile**, porta **3000**, e um banco **PostgreSQL** do próprio Coolify no mesmo projeto.
Configure `DATABASE_URL` (URL interna do banco), `ADMIN_PASSWORD` e `TOKEN_SECRET`. Ative os backups do banco no Coolify.
