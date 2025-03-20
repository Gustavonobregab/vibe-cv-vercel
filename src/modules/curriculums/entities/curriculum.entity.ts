import { integer, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { users } from '../../users/entities/user.entity'

export const curriculumStatusEnum = pgEnum('curriculum_status', ['draft', 'published', 'archived'])

export const curriculums = pgTable('curriculums', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  rawContent: text('raw_content').notNull(),
  status: curriculumStatusEnum('status').notNull().default('draft'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}) 