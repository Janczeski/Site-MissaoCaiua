# Sistema Administrativo - Missão Caiuá

## 🔐 Acesso ao Painel Admin

Para acessar o painel administrativo, navegue para:
```
/admin/login
```

### Credenciais Padrão
- **Senha:** `password`

> ⚠️ **IMPORTANTE:** Altere a senha padrão no arquivo `src/contexts/AuthContext.tsx` para produção!

## 📋 Funcionalidades do Admin

### 1. Gerenciar Notícias
- ✅ Adicionar novas notícias
- ✅ Editar notícias existentes
- ✅ Excluir notícias
- ✅ Definir categoria (Saúde, Evangelização, Assistência Social, Geral)
- ✅ Upload de imagens (URL)
- ✅ Definir data e autor

### 2. Gerenciar Projetos
- ✅ Adicionar novos projetos
- ✅ Editar projetos existentes
- ✅ Excluir projetos
- ✅ Definir categoria (Saúde Indígena, Evangelização, Assistência Social, Educação)
- ✅ Definir localização e coordenadas GPS
- ✅ Controlar valores arrecadados e metas
- ✅ Upload de imagens (URL)

## 💾 Armazenamento de Dados

Os dados são armazenados no **localStorage** do navegador, o que significa:
- ✅ Dados persistem entre sessões
- ✅ Não requer backend ou banco de dados
- ⚠️ Dados são específicos do navegador/dispositivo
- ⚠️ Limpar cache do navegador apaga os dados

### Dados Padrão
Na primeira execução, o sistema inicializa com dados padrão que incluem:
- 3 notícias de exemplo
- 4 projetos de exemplo

## 🔒 Segurança

### Autenticação
- Sessão armazenada no `sessionStorage`
- Logout automático ao fechar o navegador
- Redirecionamento automático se não autenticado

### Alterando a Senha
Edite o arquivo `src/contexts/AuthContext.tsx`:

```typescript
// Linha 10-11
const ADMIN_PASSWORD_HASH = "mc2024$admin$password";
```

Altere `password` para sua senha desejada:
```typescript
const ADMIN_PASSWORD_HASH = "mc2024$admin$SUA_SENHA_AQUI";
```

## 🚀 Deploy em Produção

### Recomendações para Produção
1. **Altere a senha padrão**
2. **Considere implementar um backend real** com:
   - Banco de dados (PostgreSQL, MongoDB, etc.)
   - API REST (Node.js, Express, etc.)
   - Autenticação JWT
   - Upload de imagens em servidor/cloud

3. **Para upload de imagens:**
   - Use serviços como Cloudinary, AWS S3, ou Imgur
   - Ou implemente upload direto no seu backend

## 📱 Acesso Móvel

O painel admin é totalmente responsivo e pode ser acessado de tablets e smartphones.

## 🔄 Backup Manual

Para fazer backup dos dados:
1. Abra o Console do navegador (F12)
2. Digite:
```javascript
// Exportar notícias
console.log(JSON.stringify(localStorage.getItem('missao_news')));

// Exportar projetos
console.log(JSON.stringify(localStorage.getItem('missao_projects')));
```
3. Copie e salve o resultado

Para restaurar:
```javascript
localStorage.setItem('missao_news', 'COLE_AQUI_O_JSON_DE_NOTICIAS');
localStorage.setItem('missao_projects', 'COLE_AQUI_O_JSON_DE_PROJETOS');
```

## 📧 Suporte

Para dúvidas ou problemas, entre em contato com o desenvolvedor.
