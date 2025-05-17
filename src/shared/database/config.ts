import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { config } from '@/shared/config'

const pool = new Pool({
  connectionString: config.database.url,
  ssl: { rejectUnauthorized: false },
})

export const db = drizzle(pool)
export const migrationClient = db
