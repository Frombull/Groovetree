# GrooveTree


## Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Supabase CLI](https://supabase.com/docs/guides/local-development)


# Running the Project

1.  Install dependencies

    ```bash
    npm install
    ```

2. Start Supabase services

    ```bash
    npx supabase start
    ```
    Save the credentials.

3. Create a ``.env`` file in the root folder, following the ``.env.template`` template and fill it in.

4. Run Database Migrations
    ```bash
    npx prisma migrate dev
    ```
    This command applies all migrations, creates the local DB and generates the Prisma client.

5. Run DB SEED (optional)

    ```bash
    npx tsx prisma/seed.ts
    ```

6. Running in DEV

    ```bash
    npm run dev
    ```

    To create a new migration:

    ```bash
    npx prisma migrate dev --name <migration-name>
    ```


# Tests
- Tests with **cypress** are located in:

    ```bash
    cypress/e2e/
    ```
    To run cypress, use:

    ```bash
    npx cypress open
    ```


# Authors
- [Marco Di Toro](https://github.com/Frombull)
- [Vitor Torres](https://github.com/Torress01)
- [Gabriel Costa](https://github.com/JoaoGabrielCostaa)