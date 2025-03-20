import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'

// Create a single instance of the database connection
export const db = drizzle(sql)

// For migrations
export const migrationClient = drizzle(sql) 