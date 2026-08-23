# HelpDesk API — Sistema de Gestão de Chamados e Suporte Técnico

Backend REST em Node.js/Express para abertura, atendimento e acompanhamento de chamados de suporte técnico.
Clientes abrem chamados e comentam; técnicos assumem, atualizam status e encerram.

## Arquitetura

```
helpdesk-api/
├── config/          # conexão com o banco (mysql2) e script de criação de tabelas
├── controllers/      # regras de negócio (auth, chamados, comentários)
├── middlewares/       # autenticação JWT e tratamento global de erros
├── models/             # acesso a dados com prepared statements
├── routes/               # rotas Express com anotações OpenAPI/Swagger
├── swagger/               # configuração do swagger-jsdoc
└── server.js
```

## Pré-requisitos

- Node.js 18+
- Um banco MySQL/PostgreSQL-compatível em nuvem (recomendado: [Aiven](https://aiven.io))

## Instalação local

```bash
npm install
cp .env.example .env
# edite o .env com as credenciais do seu banco e um JWT_SECRET forte
npm run initdb    # cria as tabelas usuarios, chamados, comentarios_chamado
npm run dev        # ou: npm start
```

A API sobe em `http://localhost:4000` (ou na porta definida em `PORT`).
Documentação interativa: `http://localhost:4000/api-docs`.

## Variáveis de ambiente (`.env`)

| Variável | Descrição |
| --- | --- |
| `PORT` | Porta da API (padrão 4000) |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Credenciais do banco MySQL |
| `DB_SSL` | `true` para exigir SSL/TLS na conexão |
| `JWT_SECRET` | Segredo usado para assinar os tokens JWT |
| `JWT_EXPIRES_IN` | Validade do token (ex: `8h`) |
| `FRONTEND_URL` | URL pública do front-end, usada para restringir o CORS |

## Autenticação

Todas as rotas em `/api/chamados` exigem um token JWT no cabeçalho:

```
Authorization: Bearer <token>
```

O token é obtido em `POST /auth/login` após o cadastro em `POST /auth/cadastro`.

## Rotas principais

| Método | Rota | Descrição | Acesso |
| --- | --- | --- | --- |
| POST | `/auth/cadastro` | Cria uma conta (cliente ou técnico) | Público |
| POST | `/auth/login` | Autentica e retorna o JWT | Público |
| GET | `/api/chamados` | Lista chamados (`?status=` opcional) | Autenticado |
| GET | `/api/chamados/:id` | Detalhe de um chamado | Autenticado |
| POST | `/api/chamados` | Abre um novo chamado | Cliente autenticado |
| PATCH | `/api/chamados/:id/status` | Atualiza status (`Aberto`/`Em Atendimento`/`Concluido`) | Técnico |
| DELETE | `/api/chamados/:id` | Encerra/remove um chamado | Técnico |
| GET | `/api/chamados/:chamadoId/comentarios` | Lista comentários do chamado | Autenticado |
| POST | `/api/chamados/:chamadoId/comentarios` | Adiciona um comentário | Autenticado |

Especificação completa e testável em `/api-docs` (Swagger UI).

## Segurança implementada

- Senhas com hash `bcryptjs` (nunca texto puro)
- Rotas privadas protegidas por JWT (`Authorization: Bearer <token>`)
- CORS restrito à URL do front-end configurada em `FRONTEND_URL`
- Todas as queries usam *prepared statements* (`mysql2`), sem concatenação de strings
- Tratamento de erros centralizado — nenhum stack trace é exposto ao cliente
- Credenciais isoladas via `dotenv`, nada hardcoded no código

## Deploy em produção

1. Suba o banco MySQL no Aiven e rode `npm run initdb` apontando para ele.
2. Crie um Web Service no [Render](https://render.com) apontando para este repositório.
   - Build command: `npm install`
   - Start command: `npm start`
   - Configure as variáveis de ambiente do `.env` no painel do Render (inclua a `FRONTEND_URL` do Vercel).
3. Acesse `https://sua-api.onrender.com/api-docs` para validar a documentação.
