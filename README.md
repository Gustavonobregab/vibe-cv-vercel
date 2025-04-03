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
- **Vercel Blob** - Armazenamento de arquivos

## Sistema de Autenticação via Google

### 1. Início do Fluxo

- Usuário acessa `/auth/google`
- É redirecionado para a página de login do Google

### 2. Autenticação no Google

- Usuário faz login no Google
- Google retorna para `/auth/google/callback` com dados do perfil (id, email, nome, foto)

### 3. Processamento do Callback

O sistema processa a autenticação no callback:

```typescript
const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "google",
    async (err: Error | null, user: PassportUser | null) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Authentication failed" });
      }

      const token = authService.generateJwtToken(user);
      res.status(HttpStatus.OK).json({
        accessToken: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
        },
      });
    }
  )(req, res, next);
};
```

### 4. Criação ou Atualização do Usuário

Quando um usuário faz login com Google pela primeira vez, o sistema:

- Verifica se já existe um usuário com o mesmo ID do Google
- Se não existir, cria um novo usuário com os dados do perfil do Google
- Se existir, atualiza os dados do usuário com as informações mais recentes

### 5. Geração e Uso do JWT

- O sistema gera um token JWT contendo o ID e email do usuário
- O token é enviado na resposta ao cliente
- Para acessar rotas protegidas, o cliente deve incluir o token no header `Authorization: Bearer <token>`
- O middleware `verifyToken` valida o token e anexa o usuário à requisição

## Sistema de Upload de CV

O sistema permite que usuários autenticados façam upload de seus currículos em formato PDF, que são armazenados de forma segura e vinculados ao perfil do usuário.

### 1. Estrutura de Dados do CV

Os currículos são armazenados no banco de dados com as seguintes informações:

```typescript
export const curriculums = pgTable("curriculums", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  cvUrl: text("cv_url").notNull(),
  status: curriculumStatusEnum("status").notNull().default("to_review"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

Os possíveis estados de um currículo são:

- `to_review` - Aguardando revisão
- `reviewing` - Em processo de revisão
- `reviewed` - Revisão concluída

### 2. Upload de Arquivo

O upload de CV utiliza o middleware Multer para processar arquivos PDF:

```typescript
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});
```

A rota de upload recebe o arquivo PDF e o título do currículo:

```typescript
router.post("/upload", upload.single("cv"), curriculumController.uploadCV);
```

### 3. Armazenamento no Vercel Blob

Os arquivos PDF são armazenados no Vercel Blob, um serviço de armazenamento seguro e escalável:

```typescript
const uploadCV = async (
  userId: UserId,
  title: string,
  file: Express.Multer.File
) => {
  // Upload CV to Vercel Blob
  const { url } = await put(
    `curriculums/${userId}/${Date.now()}-${file.originalname}`,
    file.buffer,
    {
      access: "public",
      contentType: file.mimetype,
    }
  );

  // Save curriculum with CV URL
  const curriculum = await curriculumRepository.create({
    userId,
    title,
    cvUrl: url,
  });

  if (!curriculum) {
    throw new InvalidInputException("Failed to upload CV");
  }

  return curriculum;
};
```

### 4. Segurança e Permissões

O sistema garante que apenas usuários autenticados possam fazer upload de CVs e que os usuários possam acessar apenas seus próprios currículos:

```typescript
// Ensure user can only access their own curriculums
if (curriculum.userId !== req.user?.id) {
  throw new InsufficientPermissionsException("access this curriculum");
}
```

### 5. Fluxo Completo de Upload

1. O usuário autentica-se no sistema
2. Envia uma requisição POST para `/curriculums/upload` com:
   - O arquivo PDF no campo `cv`
   - O título do currículo no campo `title`
   - O token JWT no header `Authorization`
3. O sistema valida a autenticação e o arquivo
4. O PDF é enviado para o Vercel Blob
5. Os metadados do currículo (incluindo a URL do arquivo) são salvos no banco de dados
6. O sistema retorna os dados do currículo criado

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
- `PATCH /users/:id/profile` - Completa perfil do usuário
- `GET /users` - Lista usuários (paginação)

### Curriculums

- `POST /curriculums/upload` - Faz upload de CV (PDF)
- `GET /curriculums/:id` - Obtém currículo por ID
- `PUT /curriculums/:id` - Atualiza currículo
- `GET /curriculums/user/:userId` - Lista currículos do usuário
- `GET /curriculums` - Lista currículos (paginação)

> Nota: Todas as rotas de currículos são protegidas e exigem autenticação. Os usuários só podem acessar seus próprios currículos.

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
   BLOB_READ_WRITE_TOKEN=seu-token-vercel-blob
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
