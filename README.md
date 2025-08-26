# GrooveTree

Instale as dependências do projeto

```bash
npm install
```



## Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)



# Rodando DB local
1.  Crie um ``.env`` em ``/docker`` com as informações necessárias, seguindo o template de ```/docker/.env.template```

2. Rode o docker compose

    ```bash
    cd /docker
    docker compose up -d
    ```

3. Gere o cliente Prisma (necessário sempre que o schema mudar)

    ```bash
    npx prisma generate
    ```
    
4. Execute as migrações para criar o banco de dados

    ```bash
    npx prisma migrate dev

    # Se for a primeira vez, você pode usar:
    npx prisma db push
    ```

5. Rodando SEED do DB (opcional)

    ```bash
    npx tsx prisma/seed.ts
    ```



# Rodando o projeto

1. Crie um ``.env`` na pasta raiz, seguindo o template de ``.env.template``

2. Rodando em DEV

    ```bash
    npm run dev
    ```

3. Acessando no navegador

    ```bash
    http://localhost:3000
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

- Testes com **postman** estão em:

    ```bash
    // TODO
    ```



# Autores
- [Marco Di Toro](https://github.com/Frombull) | 150 | GES
- [Vitor Torres](https://github.com/Torress01)  | 517 | GES
- [Gabriel Costa](https://github.com/JoaoGabrielCostaa) | 193 | GES