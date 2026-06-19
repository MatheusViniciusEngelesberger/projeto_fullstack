# 🎌 Anime Quotes — Projeto Fullstack Web

Aplicação web fullstack de 3 camadas para busca e inserção de citações de animes, desenvolvida como parte da disciplina de **Programação Web Fullstack**.

---

## 📋 Sumário

- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Como Executar](#como-executar)
- [Funcionalidades](#funcionalidades)
- [Segurança](#segurança)
- [Otimizações](#otimizações)
- [Rotas da API](#rotas-da-api)

---

## 🛠 Tecnologias

### Backend
| Pacote | Finalidade |
|---|---|
| `express` | Servidor HTTP / API REST |
| `mongoose` | ODM para MongoDB |
| `bcryptjs` | Criptografia de senhas |
| `jsonwebtoken` | Autenticação via JWT |
| `helmet` | Headers de segurança HTTP |
| `express-rate-limit` | Prevenção de ataques automatizados |
| `express-validator` | Sanitização e validação de parâmetros |
| `compression` | Compressão de respostas HTTP |
| `node-cache` | Cache em memória |

### Frontend
| Pacote | Finalidade |
|---|---|
| `react` | Biblioteca de UI |
| `vite` | Bundler e servidor de desenvolvimento |
| `react-hook-form` | Gerenciamento de formulários |
| `axios` | Requisições HTTP |

### Banco de Dados
- **MongoDB** (via Mongoose)

---

## 🏗 Arquitetura

```
Frontend (React SPA)
      │  HTTP / REST
      ▼
Backend (Express.js)
      │  Mongoose / Pool de Conexões
      ▼
Banco de Dados (MongoDB)
```

A aplicação segue o padrão **Single-Page Application (SPA)**: toda a comunicação entre frontend e backend é feita via requisições HTTP REST, sem recarregamento de página.

---

## 📁 Estrutura de Pastas

```
projeto_fullstack/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Configuração e conexão com o MongoDB
│   │   ├── models/
│   │   │   ├── User.js              # Model de usuário
│   │   │   ├── Quote.js             # Model de citação
│   │   │   └── Log.js               # Model de log de auditoria
│   │   └── routes/
│   │       ├── authRoutes.js        # Rotas de autenticação (login/logout)
│   │       └── quoteRoutes.js       # Rotas de busca e inserção de quotes
│   ├── .env                         # Variáveis de ambiente
│   ├── server.js                    # Entry point do servidor
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Header.jsx
    │   │   ├── SearchForm.jsx
    │   │   ├── QuoteList.jsx
    │   │   ├── QuoteCard.jsx
    │   │   └── InsertQuoteForm.jsx
    │   ├── contexts/
    │   │   ├── authContext.js
    │   │   ├── AuthProvider.jsx
    │   │   ├── QuoteContext.jsx
    │   │   └── useAuth.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── vite.config.js
    └── package.json
```

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [MongoDB](https://www.mongodb.com/) rodando localmente ou via Atlas
- npm

---

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd projeto_fullstack
```

### 2. Configure as variáveis de ambiente do backend

Edite o arquivo `backend/.env`:

```env
PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017/anime_quotes_db
JWT_SECRET=chave_secreta_do_projeto_2
JWT_EXPIRES_IN=1h
```

> ⚠️ Em produção, substitua `JWT_SECRET` por uma string longa e aleatória, e use HTTPS.

### 3. Instale as dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## ▶️ Como Executar

### Backend

```bash
cd backend
npm start
```

O servidor estará disponível em `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## 🔧 Funcionalidades

### 🔐 Login
- Autenticação com e-mail e senha
- Geração de token JWT com expiração configurável
- Apenas usuários autenticados podem realizar busca e inserção
- Tokens são invalidados corretamente no logout

### 🔍 Busca
- Busca de citações de animes por filtros
- Disponível apenas para usuários com sessão ativa

### ➕ Inserção
- Cadastro de novas citações
- Validação de campos no servidor antes de persistir
- Disponível apenas para usuários com sessão ativa

---

## 🔒 Segurança

| Categoria | Implementação |
|---|---|
| **Falhas de criptografia** | Senhas armazenadas com `bcryptjs` (hash + salt); variáveis sensíveis em `.env` |
| **Injeção** | Uso de `express-validator` para sanitização; Mongoose previne NoSQL injection por padrão |
| **XSS** | Headers de proteção via `helmet`; sanitização de inputs |
| **Autenticação** | JWT com expiração; rate limiting via `express-rate-limit` para prevenir ataques de força bruta |
| **Logs e monitoramento** | Model `Log.js` registra erros de autenticação, buscas e inserções |

---

## ⚡ Otimizações

- **Compressão de respostas**: middleware `compression` aplicado no servidor Express
- **Cache no backend**: `node-cache` para caching em memória de respostas frequentes
- **Pool de conexões**: configurado via Mongoose (`maxPoolSize`) no `database.js`
- **Compressão de estáticos**: configurada no build do Vite (`npm run build`)

---

## 🌐 Rotas da API

### Autenticação

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Realiza login e retorna token JWT | Não |
| `POST` | `/api/auth/logout` | Invalida a sessão do usuário | Sim |

### Citações

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `GET` | `/api/quotes` | Lista/busca citações | Sim |
| `POST` | `/api/quotes` | Insere nova citação | Sim |

> Todas as rotas protegidas exigem o header `Authorization: Bearer <token>`.

---

## 👥 Autores

Projeto desenvolvido para a disciplina de **Programação Web Fullstack**.
