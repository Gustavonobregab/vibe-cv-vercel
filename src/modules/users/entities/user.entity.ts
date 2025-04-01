import { sql } from 'drizzle-orm'
import { text, timestamp, pgTable, boolean, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  googleId: varchar('google_id', { length: 255 }).unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  picture: text('picture'),
  isActive: boolean('is_active').notNull().default(true),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  phone: varchar('phone', { length: 20 }),
  bio: text('bio'),
  location: varchar('location', { length: 255 }),
  website: varchar('website', { length: 255 }),
  company: varchar('company', { length: 255 }),
  jobTitle: varchar('job_title', { length: 255 }),
  cvFileUrl: text('cv_file_url'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`)
}) 