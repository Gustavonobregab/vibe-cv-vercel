import express from 'express';
import { errorHandler } from './shared/middlewares/error-handler';
import {
  NotFoundException,
  InvalidInputException,
  MissingRequiredFieldException,
  InvalidCredentialsException,
  TokenExpiredException,
  InsufficientPermissionsException,
  DuplicateResourceException,
  ValidationException,
  RateLimitExceededException,
  DatabaseErrorException,
  MaintenanceModeException
} from './shared/errors/http-exception';

console.log('Starting server initialization...');

const app = express();

console.log('Setting up middleware...');
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  console.log('Handling root route request');
  res.send('Hello World');
});

// Example error routes
app.get('/error', () => {
  console.log('Handling error route request');
  throw new NotFoundException('Resource not found');
});

// 400 Bad Request examples
app.post('/validate', () => {
  throw new InvalidInputException('Invalid email format');
});

app.post('/required', () => {
  throw new MissingRequiredFieldException('password');
});

// 401 Unauthorized examples
app.post('/login', () => {
  throw new InvalidCredentialsException();
});

app.get('/token', () => {
  throw new TokenExpiredException();
});

// 403 Forbidden examples
app.get('/admin', () => {
  throw new InsufficientPermissionsException('ADMIN_ACCESS');
});

// 409 Conflict examples
app.post('/users', () => {
  throw new DuplicateResourceException('User');
});

// 422 Validation examples
app.post('/validate-data', () => {
  throw new ValidationException('Age must be between 18 and 100');
});

// 429 Rate Limit examples
app.get('/rate-limit', () => {
  throw new RateLimitExceededException(100, 'hour');
});

// 500 Internal Server Error examples
app.get('/database', () => {
  throw new DatabaseErrorException('Connection timeout');
});

// 503 Service Unavailable examples
app.get('/maintenance', () => {
  throw new MaintenanceModeException();
});

// Error handling middleware - must be registered last
console.log('Setting up error handler...');
// Error handling middleware must have exactly 4 parameters for Express to recognize it
app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
  errorHandler(err, req, res, next);
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  console.log('Starting server in development mode...');
  const PORT = 9999;
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

console.log('Server initialization complete');

// For Vercel
export default app;