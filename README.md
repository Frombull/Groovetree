# GrooveTree

Plataforma estilo Linktree especializada para DJs e músicos, permitindo criar páginas personalizadas com links, embeds de músicas, fotos e agenda de shows.

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuindo](#contribuindo)
- [Autores](#autores)
- [Licença](#licença)

## Sobre o Projeto

GrooveTree é uma plataforma web desenvolvida especificamente para artistas musicais, DJs e produtores que desejam centralizar sua presença digital em uma única página personalizável. Inspirado no conceito do Linktree, o GrooveTree oferece funcionalidades especializadas para o universo da música eletrônica e eventos.

A plataforma permite que artistas criem sua página profissional onde fãs e promoters podem:
- Acessar links para redes sociais e plataformas de streaming
- Visualizar fotos e galerias do artista
- Conferir embeds de músicas e sets
- Consultar agenda de shows e eventos futuros
- Conectar-se diretamente com o artista

## Funcionalidades

### Para Artistas (Usuários)
- Criação de página personalizada com URL única
- Gerenciamento de links para redes sociais e plataformas
- Upload e organização de fotos e galerias
- Incorporação de embeds (Spotify, SoundCloud, YouTube, etc.)
- Cadastro e atualização de agenda de shows
- Personalização visual da página (cores, layout, bio)

### Para Visitantes
- Visualização da página do artista
- Acesso rápido a todos os links e conteúdos
- Consulta de próximos shows e eventos
- Reprodução de músicas e sets via embeds

## Tecnologias Utilizadas

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL (via Supabase)
- **Autenticação**: Supabase Auth
- **Storage**: Supabase Storage (para imagens)
- **ORM**: Prisma
- **Testes**: Cypress (E2E), Postman (API)
- **Containerização**: Docker
- **Desenvolvimento**: Supabase CLI

## Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [Docker](https://www.docker.com/) (para executar o Supabase localmente)
- [Supabase CLI](https://supabase.com/docs/guides/local-development) (para gerenciamento do backend)

## Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/groovetre.git
cd groovetre
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

Inicie os serviços do Supabase localmente:

```bash
npx supabase start
```

O comando exibirá as credenciais de acesso. Anote-as para o próximo passo.

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no template `.env.template`:

```bash
cp .env.template .env
```

Preencha o arquivo `.env` com as credenciais fornecidas pelo comando `supabase start`.

### 5. Configure o banco de dados

Sincronize o schema do Prisma com o banco de dados:

```bash
npx prisma db push
```

Gere o cliente Prisma:

```bash
npx prisma generate
```

### 6. Popule o banco de dados (opcional)

Execute o seed para adicionar dados de exemplo:

```bash
npx tsx prisma/seed.ts
```

Este comando criará usuários, páginas e eventos de exemplo para facilitar o desenvolvimento.

## Executando o Projeto

### Ambiente de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

### Build de Produção

```bash
npm run build
npm start
```

## Testes

### Testes End-to-End (Cypress)

Os testes E2E estão localizados em `cypress/e2e/` e cobrem fluxos principais como:
- Criação e edição de páginas
- Upload de fotos
- Adição de embeds e links
- Cadastro de shows

Para executar os testes com interface gráfica:

```bash
npx cypress open
```

Para executar os testes em modo headless:

```bash
npx cypress run
```

### Testes de API (Postman)

A documentação e collections do Postman estão em desenvolvimento.

## Estrutura do Projeto

```
groovetre/
├── cypress/          # Testes E2E
│   └── e2e/
├── prisma/          # Schema e migrations do Prisma
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/         # Páginas e rotas (App Router)
│   ├── components/  # Componentes React reutilizáveis
│   ├── lib/         # Utilitários e configurações
│   └── types/       # Definições de tipos TypeScript
├── public/          # Arquivos estáticos
├── .env.template    # Template de variáveis de ambiente
└── package.json     # Dependências do projeto
```

## Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Siga os padrões de código estabelecidos no projeto
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Certifique-se de que todos os testes passam antes de submeter o PR

## Autores

- **Marco Di Toro** - [GitHub](https://github.com/Frombull) - 150 | GES
- **Gabriel Costa** - [GitHub](https://github.com/JoaoGabrielCostaa) - 193 | GES
- **Vitor Torres** - [GitHub](https://github.com/Torress01) - 517 | GES

---

**GrooveTree** - Centralize sua presença digital e conecte-se com seus fãs
