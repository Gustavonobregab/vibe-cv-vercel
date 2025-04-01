import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from '../../users/entities/user.entity'

export const curriculumStatusEnum = pgEnum('curriculum_status', [
  'draft',
  'submitted',
  'processing',
  'completed',
  'failed'
])

export const curriculums = pgTable('curriculums', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  rawContent: text('raw_content').notNull(),
  status: curriculumStatusEnum('status').notNull().default('draft'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}) 