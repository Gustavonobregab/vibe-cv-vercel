# Fast CV API

API para gerenciamento de currículos e autenticação de usuários.

## Arquitetura

O projeto segue uma arquitetura modular baseada em domínios, com separação clara de responsabilidades:

```
src/
├── modules/           # Módulos de domínio
│   ├── auth/         # Autenticação e autorização
│   ├── users/        # Gerenciamento de usuários
│   ├── payments/     # Processamento de pagamentos
│   └── curriculums/  # Gerenciamento de currículos
├── shared/           # Código compartilhado
│   ├── config/       # Configurações
│   ├── errors/       # Tratamento de erros
│   ├── middlewares/  # Middlewares Express
│   ├── types/        # Tipos globais
│   └── db/          # Configuração do banco de dados
└── index.ts          # Ponto de entrada
```

## Tecnologias Principais

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM para PostgreSQL
- **Passport.js** - Middleware de autenticação
- **JWT** - Tokens de autenticação
- **Zod** - Validação de schemas
- **Cors** - Middleware para CORS
- **Helmet** - Segurança HTTP
- **Compression** - Compressão de respostas
- **Dotenv** - Variáveis de ambiente

## Fluxo de Autenticação e Criação de Usuário

### 1. Início do Fluxo

- Usuário acessa `/auth/google`
- É redirecionado para a página de login do Google

### 2. Autenticação no Google

- Usuário faz login no Google
- Google retorna para `/auth/google/callback` com:
  - Código de autorização
  - Dados do perfil (id, email, nome, foto)

### 3. Processamento do Callback

O fluxo de criação/atualização de usuário acontece no callback do Passport:

```typescript
// 1. Passport recebe o perfil do Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["email", "profile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 2. Valida e cria/atualiza usuário
        const user = await validateGoogleUser(profile as GoogleProfile);
        done(null, user);
      } catch (error) {
        done(error as Error);
      }
    }
  )
);
```

### 4. Validação e Criação do Usuário

O serviço de autenticação valida e cria o usuário:

```typescript
const createUser = async (profile: GoogleProfile): Promise<User> => {
  const { id, displayName, emails, photos } = profile;
  const email = emails[0].value;
  const picture = photos?.[0]?.value;

  // Find or create user
  const existingUser = await userService.getUserByGoogleId(id);
  if (!existingUser) {
    return await userService.createFromGoogle({
      googleId: id,
      email,
      name: displayName,
      picture,
      isActive: true,
    });
  }

  return existingUser;
};
```

### 5. Criação no Banco

O repositório cria o usuário no banco de dados:

```typescript
const create = async ({
  googleId,
  email,
  name,
  picture,
  isActive,
}: CreateFromGoogleDto): Promise<User> => {
  const [user] = await db
    .insert(users)
    .values({
      googleId,
      email,
      name,
      picture,
      isActive,
    })
    .returning();
  return user;
};
```

### 6. Geração do Token

- Sistema gera JWT com ID e email do usuário
- Token é enviado na resposta

### 7. Uso do Token

- Cliente armazena token
- Envia token no header `Authorization: Bearer <token>`
- Middleware `verifyToken` valida token e anexa usuário à requisição

## Endpoints

### Auth

- `GET /auth/google` - Inicia fluxo de autenticação
- `GET /auth/google/callback` - Callback do Google
- `GET /auth/verify` - Verifica token JWT

### Users

- `GET /users/:id` - Busca usuário por ID
- `GET /users/google/:googleId` - Busca usuário por Google ID
- `GET /users/email/:email` - Busca usuário por email
- `PUT /users/:id` - Atualiza dados do usuário
- `PATCH /users/:id/complete-profile` - Completa perfil do usuário
- `POST /users/:id/cv` - Faz upload do CV
- `GET /users` - Lista usuários (paginação)

> Nota: Não existe endpoint de criação de usuário público. Usuários são criados automaticamente no primeiro login com Google.

## Configuração e Execução

1. **Pré-requisitos**

   ```bash
   Node.js >= 18
   PostgreSQL >= 14
   ```

2. **Instalação**

   ```bash
   # Clone o repositório
   git clone https://github.com/seu-usuario/fast-cv.git
   cd fast-cv

   # Instale as dependências
   npm install
   ```

3. **Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz:

   ```
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/fast-cv
   JWT_SECRET=seu-secret-aqui
   GOOGLE_CLIENT_ID=seu-client-id
   GOOGLE_CLIENT_SECRET=seu-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   ```

4. **Execução**

   ```bash
   # Desenvolvimento
   npm run dev

   # Produção
   npm run build
   npm start
   ```

5. **Testes**
   ```bash
   npm test
   ```

## Deploy

O projeto está configurado para deploy no Vercel. O arquivo `vercel.json` define:

- Build usando `@vercel/node`
- Entrada em `src/index.ts`
- Roteamento para todas as requisições

Para deploy:

1. Instale Vercel CLI: `npm i -g vercel`
2. Execute: `vercel`
3. Siga as instruções do CLI

## Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## Licença

MIT
