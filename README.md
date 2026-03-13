# FinControl Mobile

Repositorio standalone do app mobile, separado do projeto web para evitar impacto no monorepo principal.

## Requisitos

- Node.js 18+
- Expo Go no celular
- Backend web rodando na porta 3000

## Configuracao

1. Copie `.env.example` para `.env` se quiser customizar a URL da API.
2. Ajuste `EXPO_PUBLIC_API_URL` para o IP da maquina na rede local.

## Execucao

```bash
npm install
npm start
```

URL padrao da API local:

```bash
http://10.120.161.158:3000
```
