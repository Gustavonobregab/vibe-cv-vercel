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
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 2. Busca usuário existente pelo googleId
        const existingUser = await userService.getByGoogleId(profile.id);

        if (existingUser) {
          // 3a. Se existe, atualiza dados do Google
          const updatedUser = await userService.updateGoogleProfile(
            existingUser.id,
            {
              email: profile.emails[0].value,
              name: profile.displayName,
              picture: profile.photos?.[0]?.value,
            }
          );
          return done(null, updatedUser);
        }

        // 3b. Se não existe, cria novo usuário
        const newUser = await userService.createFromGoogle({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos?.[0]?.value,
          isActive: true,
        });
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);
```

### 4. Validações no Serviço

O serviço de usuário realiza várias validações antes de criar um novo usuário:

```typescript
const createFromGoogle = async (data: CreateGoogleUserDto) => {
  // 1. Verifica se já existe usuário com este googleId
  const existingByGoogleId = await userRepository.getByGoogleId(data.googleId);
  if (existingByGoogleId) {
    throw new DuplicateResourceException(
      "User with this Google ID already exists"
    );
  }

  // 2. Verifica se já existe usuário com este email
  const existingByEmail = await userRepository.getByEmail(data.email);
  if (existingByEmail) {
    // Se existe usuário com este email mas sem googleId, atualiza
    if (!existingByEmail.googleId) {
      return await userRepository.update(existingByEmail.id, {
        googleId: data.googleId,
        name: data.name,
        picture: data.picture,
        isActive: true,
      });
    }
    throw new DuplicateResourceException("User with this email already exists");
  }

  // 3. Cria novo usuário
  const user = await userRepository.create(data);
  if (!user) {
    throw new InvalidInputException("Failed to create user");
  }
  return user;
};
```

### 5. Criação no Banco

O repositório cria o usuário no banco de dados:

```typescript
const create = async (data: CreateGoogleUserDto): Promise<User> => {
  const [user] = await db
    .insert(users)
    .values({
      ...data,
      isActive: true,
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
- `PUT /users/:id` - Atualiza dados do usuário
- `GET /users/me` - Retorna usuário autenticado

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
