# GrooveTree

Descrição feliz :)



## Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Supabase CLI](https://supabase.com/docs/guides/local-development)



# Rodando o projeto

1.  Instale as dependências

    ```bash
    npm install
    ```

2. Inicie os serviços do Supabase

    ```bash
    npx supabase start
    ```
    Ao final, o terminal vai mostrar as credenciais de acesso local, guarde elas para o próximo passo.

3. Crie um ``.env`` na pasta raiz, seguindo o template de ``.env.template`` E preencha.

4. Execute as Migrações do Banco de Dados
    ```bash
    npx prisma migrate dev
    ```
    Esse comando aplica todas as migrações, cria o DB local e gera o cliente Prisma.

5. Rode o SEED do DB (opcional)

    ```bash
    npx tsx prisma/seed.ts
    ```

6. Rodando em DEV

    ```bash
    npm run dev
    ```

    E Para criar migração nova:

    ```bash
    npx prisma migrate dev --name <nome-da-mudanca>
    ```


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
    Dentro de nosso time do postman
    ```



# Autores
- [Marco Di Toro](https://github.com/Frombull) | 150 | GES
- [Gabriel Costa](https://github.com/JoaoGabrielCostaa) | 193 | GES
- [Vitor Torres](https://github.com/Torress01)  | 517 | GES