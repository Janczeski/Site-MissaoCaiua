# Guia de Configuração do Supabase - Missão Caiuá

## 📋 Passo a Passo Completo

### 1. Criar Conta no Supabase

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub, Google ou e-mail
4. Crie uma nova organização (pode ser seu nome ou "Missão Caiuá")

### 2. Criar Novo Projeto

1. Clique em **"New Project"**
2. Preencha:
   - **Name:** `missao-caiua`
   - **Database Password:** Crie uma senha forte (ANOTE!)
   - **Region:** `South America (São Paulo)`
   - **Pricing Plan:** Free (até 500MB de storage)
3. Clique em **"Create new project"**
4. Aguarde ~2 minutos para o projeto ser criado

### 3. Obter Credenciais

1. No menu lateral, clique em **"Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Copie os valores:
   - **Project URL** (algo como: https://xxxxx.supabase.co)
   - **anon public** key (chave longa começando com "eyJ...")

### 4. Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie o arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

2. Substitua pelos valores copiados do Supabase

### 5. Criar Tabelas no Banco de Dados

1. No Supabase, clique em **"SQL Editor"** (ícone </>)
2. Clique em **"New query"**
3. Cole o SQL abaixo e clique em **"RUN"**:

```sql
-- Tabela de Notícias
CREATE TABLE news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Projetos
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  image TEXT NOT NULL,
  raised NUMERIC NOT NULL DEFAULT 0,
  goal NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (público pode ler, autenticados podem escrever)
CREATE POLICY "Permitir leitura pública de notícias"
  ON news FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir todas operações para autenticados"
  ON news FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir leitura pública de projetos"
  ON projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir todas operações para autenticados"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Índices para melhor performance
CREATE INDEX idx_news_date ON news(date DESC);
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_projects_category ON projects(category);
```

### 6. Configurar Storage para Imagens

1. No menu lateral, clique em **"Storage"**
2. Clique em **"Create a new bucket"**
3. Configure:
   - **Name:** `images`
   - **Public bucket:** ✅ (marque para permitir acesso público)
4. Clique em **"Create bucket"**

5. Clique no bucket **"images"**
6. Clique em **"Policies"** → **"New policy"**
7. Selecione **"Allow public read access"**
8. Clique em **"Review"** → **"Save policy"**

### 7. Inserir Dados Iniciais (Opcional)

Execute este SQL para inserir dados de exemplo:

```sql
-- Inserir notícias de exemplo
INSERT INTO news (title, subtitle, date, category, image, content, author) VALUES
  (
    'Hospital Indígena Amplia Atendimento',
    'Novas especialidades médicas disponíveis para atender melhor as comunidades indígenas',
    '2024-01-15',
    'saúde',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
    'O Hospital Indígena da Missão Caiuá ampliou sua capacidade de atendimento com a chegada de novos profissionais especializados.',
    'Equipe Missão Caiuá'
  ),
  (
    'Campanha de Cestas Básicas',
    'Distribuição beneficia 200 famílias indígenas',
    '2023-12-20',
    'assistência',
    'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=600&h=400&fit=crop',
    'Nossa campanha mensal alcançou 200 famílias indígenas neste mês.',
    'Departamento Social'
  );

-- Inserir projetos de exemplo
INSERT INTO projects (title, description, category, location, coordinates, image, raised, goal) VALUES
  (
    'Hospital Indígena',
    'Único hospital indígena de média complexidade do Brasil',
    'Saúde Indígena',
    'Dourados - MS',
    '[-22.2211, -54.8056]',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop',
    125000,
    200000
  ),
  (
    'Evangelização nas Aldeias',
    'Trabalho missionário junto aos povos indígenas',
    'Evangelização',
    'Dourados - MS',
    '[-22.2211, -54.8056]',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
    45000,
    80000
  );
```

### 8. Testar Conexão

1. Reinicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse `/admin/login`
3. As notícias e projetos devem carregar do banco Supabase!

## 🔐 Autenticação Admin

Para proteger o admin com autenticação real do Supabase:

1. No Supabase, vá em **"Authentication"** → **"Users"**
2. Clique em **"Add user"** → **"Create new user"**
3. Configure:
   - **Email:** admin@missaocaiua.org.br
   - **Password:** sua-senha-admin
4. Clique em **"Create user"**

## 📁 Upload de Imagens

Ao adicionar notícias/projetos:
1. Clique em **"Escolher arquivo"**
2. A imagem será enviada automaticamente para o Supabase Storage
3. A URL será gerada e salva no banco

## 🚀 Deploy no Vercel

1. No Vercel, vá em **Settings** → **Environment Variables**
2. Adicione:
   - `VITE_SUPABASE_URL` = seu-project-url
   - `VITE_SUPABASE_ANON_KEY` = sua-anon-key
3. Faça redeploy do projeto

## 📊 Monitoramento

Acesse o Dashboard do Supabase para:
- Ver estatísticas de uso
- Monitorar requisições
- Fazer backup do banco
- Ver logs de erros

## 💰 Limites do Plano Gratuito

- **Banco de Dados:** 500MB
- **Storage:** 1GB
- **Transferência:** 2GB/mês
- **Requisições:** 50.000/mês

Para produção com mais tráfego, considere o plano Pro ($25/mês).

## 🔧 Troubleshooting

**Erro: "Invalid API key"**
- Verifique se copiou a chave correta (anon public)
- Confirme que o arquivo .env está na raiz do projeto

**Erro: "relation news does not exist"**
- Execute novamente o SQL de criação de tabelas

**Imagens não aparecem:**
- Verifique se o bucket "images" está marcado como público
- Confirme as políticas de acesso

## 📞 Suporte

- Documentação Supabase: https://supabase.com/docs
- Discord Supabase: https://discord.supabase.com
