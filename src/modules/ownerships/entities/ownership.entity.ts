import { integer, pgTable, timestamp } from 'drizzle-orm/pg-core'
import { users } from '../../users/entities/user.entity'
import { curriculums } from '../../curriculums/entities/curriculum.entity'

export const ownerships = pgTable('ownerships', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  curriculumId: integer('curriculum_id').notNull().references(() => curriculums.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}) 