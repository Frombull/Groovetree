# 🚀 Guia de Configuração - GrooveTree

Este guia fornece instruções passo a passo para configurar e executar o projeto GrooveTree usando o Supabase Cloud.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **[Node.js](https://nodejs.org/)** (versão 18 ou superior)
- **[Git](https://git-scm.com/)** para clonar o repositório
- Uma conta no **[Supabase](https://supabase.com/)** (gratuita)

---

## 🔧 Passo 1: Clonar o Repositório

```bash
git clone https://github.com/Torress01/Groovetrees.git
cd Groovetrees/Groovetree
```

---

## 📦 Passo 2: Instalar Dependências

```bash
npm install
```

Este comando irá instalar todas as dependências necessárias listadas no `package.json`.

---

## ☁️ Passo 3: Configurar o Supabase Cloud

### 3.1 Criar um Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em **"New Project"**
3. Preencha as informações:
   - **Name**: GrooveTree (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte (guarde-a!)
   - **Region**: Escolha a região mais próxima
4. Clique em **"Create new project"**
5. Aguarde alguns minutos até o projeto estar pronto

### 3.2 Obter as Credenciais do Supabase

1. No dashboard do seu projeto, vá em **Settings** > **API**
2. Você encontrará as seguintes informações:
   - **Project URL** (em "Config")
   - **anon public** (em "Project API keys")
   - **service_role** (em "Project API keys") - ⚠️ **Mantenha esta chave secreta!**

### 3.3 Configurar o Database URL

1. No dashboard, vá em **Settings** > **Database**
2. Role até **Connection string** > **URI**
3. Copie a URI no formato Prisma:
   ```
   postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
4. Substitua `[YOUR-PASSWORD]` pela senha do banco que você criou

### 3.4 Configurar Storage no Supabase

1. No dashboard, vá em **Storage**
2. Crie dois buckets públicos:
   - **avatars** (para fotos de perfil)
   - **photos** (para galeria de fotos)
3. Para cada bucket:
   - Clique nos 3 pontinhos ao lado do bucket
   - Selecione **"Edit bucket"**
   - Marque **"Public bucket"**
   - Salve as alterações

---

## 🔑 Passo 4: Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo `.env`:

```bash
# Windows (PowerShell)
New-Item .env

# Linux/Mac
touch .env
```

2. Abra o arquivo `.env` e adicione as seguintes variáveis:

```env
# Database URL do Supabase (obtido no Passo 3.3)
DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true"

# JWT Secret (crie uma string aleatória segura)
JWT_SECRET="sua-chave-secreta-muito-segura-aqui"

# API URL (URL do seu app em produção, em dev use localhost)
API_URL="http://localhost:3000"

# Supabase Storage Configuration
S3_STORAGE_URL="https://xxx.supabase.co/storage/v1/s3"
S3_ACCESS_KEY="sua-access-key-do-supabase"
S3_SECRET_KEY="sua-secret-key-do-supabase"
S3_REGION="us-east-1"

# Supabase Public Keys
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-anon-key-aqui"

# Supabase Service Role (⚠️ NUNCA compartilhe esta chave!)
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key-aqui"
```

---

## 🗄️ Passo 5: Configurar o Banco de Dados

### 5.1 Sincronizar o Schema com o Prisma

```bash
npx prisma db push
```

Este comando irá criar todas as tabelas no seu banco de dados Supabase de acordo com o schema definido.

### 5.2 Gerar o Cliente Prisma

```bash
npx prisma generate
```

Isso irá gerar o cliente Prisma necessário para interagir com o banco de dados.

### 5.3 Popular o Banco (Opcional)

Se você quiser adicionar dados de exemplo:

```bash
npx tsx prisma/seed.ts
```

---

## 🎨 Passo 6: Configurar Buckets (opcional)

Execute o script para criar as pastas necessárias caso nao existam:

```bash
node scripts/setup-storage.js
```

---

## ▶️ Passo 7: Executar o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em: **http://localhost:3000**

### Modo Produção

```bash
# Build
npm run build

# Start
npm start
```

---

## 🧪 Testes

### Testes E2E com Cypress

1. Com o servidor rodando em desenvolvimento (`npm run dev`)
2. Em outro terminal, execute:

```bash
# Modo interativo
npx cypress open

# Modo headless
npx cypress run
```

Os testes estão localizados em: `cypress/e2e/`

---

## 🔍 Verificando se Tudo Está Funcionando

### Checklist de Verificação:

- [ ] ✅ Servidor está rodando em http://localhost:3000
- [ ] ✅ Página inicial carrega sem erros
- [ ] ✅ É possível criar uma conta (Sign Up)
- [ ] ✅ É possível fazer login
- [ ] ✅ Upload de avatar funciona
- [ ] ✅ Dashboard está acessível

### Comandos Úteis:

```bash
# Ver logs do Prisma Studio (interface visual do DB)
npx prisma studio

# Ver estrutura do banco
npx prisma db pull

# Resetar o banco (⚠️ apaga todos os dados!)
npx prisma migrate reset
```

---

## 🐛 Troubleshooting

### Erro: "Can't reach database server"

- Verifique se o `DATABASE_URL` no `.env` está correto
- Confirme que você substituiu `[YOUR-PASSWORD]` pela senha correta
- Teste a conexão no Prisma Studio: `npx prisma studio`

### Erro: "Invalid API key"

- Verifique se as chaves do Supabase (`NEXT_PUBLIC_SUPABASE_ANON_KEY` e outras) estão corretas
- Confirme que você copiou as chaves corretas do dashboard

### Upload de imagens não funciona

- Verifique se os buckets `avatars` e `photos` foram criados no Supabase Storage
- Confirme que ambos os buckets estão marcados como públicos
- Verifique se as credenciais S3 estão corretas no `.env`

### Porta 3000 já está em uso

```bash
# Windows (PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## 📚 Estrutura do Projeto

```
Groovetree/
├── src/
│   ├── app/              # Páginas e rotas Next.js
│   │   ├── api/          # API Routes
│   │   ├── components/   # Componentes React
│   │   ├── contexts/     # Context Providers
│   │   └── hooks/        # Custom Hooks
│   └── lib/              # Utilitários e configurações
├── prisma/
│   ├── schema.prisma     # Schema do banco de dados
│   ├── seed.ts           # Dados iniciais
│   └── migrations/       # Migrações do banco
├── public/
│   └── uploads/          # Arquivos de upload (local)
└── cypress/              # Testes E2E
```

---

## 👥 Autores

- [Marco Di Toro](https://github.com/Frombull) | 150 | GES
- [Gabriel Costa](https://github.com/JoaoGabrielCostaa) | 193 | GES
- [Vitor Torres](https://github.com/Torress01) | 517 | GES

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 🆘 Precisa de Ajuda?

- Abra uma [Issue no GitHub](https://github.com/Torress01/Groovetrees/issues)
- Consulte a [documentação do Supabase](https://supabase.com/docs)
- Consulte a [documentação do Prisma](https://www.prisma.io/docs)
- Consulte a [documentação do Next.js](https://nextjs.org/docs)
