import dotenv from 'dotenv'
import { InvalidInputException } from '../errors/http-exception'

// Load environment variables from .env file
dotenv.config()

// Validate critical configuration
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key') {
  throw new InvalidInputException('JWT_SECRET environment variable is not properly set')
}

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/fast-cv'
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  abacatePay: {
    key: process.env.ABACATEPAY_API_KEY!
  },
  supabase: {
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }
} 