import { pgEnum, pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core'
import { users } from '../../users/entities/user.entity'

export const curriculumStatusEnum = pgEnum('curriculum_status', [
  'to_review',
  'reviewing',
  'reviewed'
])

export const curriculums = pgTable('curriculums', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  cvUrl: text('cv_url').notNull(),
  aiAnalysis: jsonb('ai_analysis'),
  status: curriculumStatusEnum('status').notNull().default('to_review'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}) 