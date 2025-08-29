# GrooveTree

Descrição feliz



## Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Supabase CLI](https://supabase.com/docs/guides/local-development)



# Rodando o projeto

1.  Instale as dependências do projeto

    ```bash
    npm install
    ```

2. Inicie os serviços do Supabase

    ```bash
    supabase start
    ```
    Ao final, o terminal vai mostrar as credenciais de acesso local, guarde elas para o próximo passo.

3. Crie um ``.env`` na pasta raiz, seguindo o template de ``.env.template``. Em seguida, preencha com as informações fornecidas pelo comando ``supabase start``

4. Sincronize o Banco de Dados com o Schema
    ```bash
    npx prisma db push
    ```

5. Gere o cliente Prisma
    ```bash
    npx prisma generate
    ```

6. Rode o SEED do DB (opcional)

    ```bash
    npx tsx prisma/seed.ts
    ```

7. Rodando em DEV

    ```bash
    npm run dev
    ```
    
    Ficará disponível em http://localhost:3000



# Testes
- Testes com **cypress** estão em:

    ```bash
    cypress/e2e/
    ```
    para executar o cypress, use:

    ```bash
    npx cypress open
    ```

- Testes com **postman**:

    ```bash
    // TODO
    ```



# Autores
- [Marco Di Toro](https://github.com/Frombull) | 150 | GES
- [Gabriel Costa](https://github.com/JoaoGabrielCostaa) | 193 | GES
- [Vitor Torres](https://github.com/Torress01)  | 517 | GES