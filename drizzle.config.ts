import type { Config } from 'drizzle-kit'

export default {
  schema: './src/shared/database/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL || '',
  },
} satisfies Config 