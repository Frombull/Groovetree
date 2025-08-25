# GrooveTree

Descrição feliz

## Rodando DB local
Instale o [docker](https://www.docker.com/)

Crie um ``.env`` em ``/docker/`` com as informaçoes necessárias, seguindo o tempalte de ```/docker/.env.template``` 

```bash
cd /docker
docker compose up -d
```

# Rodando o projeto

1. Instale as dependencias
```bash
npm run dev
```

2. Crie um ``.env`` na pasta raiz e na pasta ``/docker/``, seguindo cada ``.env.template``

3. Rodando em DEV

```bash
npm run dev
```

4. Rodando SEED do DB
```bash
npx prisma db seed
```

5. Acessando no navegador

```bash
http://localhost:3000
```

# Testes
Testes E2E com **cypress** estão em:
```bash
cypress/e2e/
```
para executar o cypress, use:
```bash
npx cypress open
```

Testes de API, com **postman** estão em:
```bash
// TODO
```

# Autores
- [Marco Di Toro](https://github.com/Frombull) | 150 | GES
- [Vitor Torres](https://github.com/Torress01)  | 517 | GES
- [Gabriel Costa](https://github.com/JoaoGabrielCostaa) | 193 | GES