# GrooveTree

Descrição feliz

## Rodando DB local
Instale o [docker](https://www.docker.com/)

Crie um ``.env`` em ``/docker/`` com as informaçoes necessárias, seguindo o tempalte de ```/docker/.env.template``` 

```
cd /docker
docker compose up -d
```

# Rodando o projeto

1. Instale as dependencias
```
npm run dev
```

2. Crie um ``.env`` na pasta raiz e na pasta ``/docker/``, seguindo cada ``.env.template``

3. Rodando em DEV

```
npm run dev
```

4. Rodando SEED do DB
```
npx prisma db seed
```

5. Acessando no navegador

```
http://localhost:3000
```

# Autores
- [Marco Di Toro](https://github.com/Frombull) | 150 | GES
- [Vitor Torres](https://github.com/Torress01)  | 517 | GES
- [Gabriel Costa](https://github.com/JoaoGabrielCostaa) | 193 | GES