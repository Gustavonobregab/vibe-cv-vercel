import { pgEnum, pgTable, text, timestamp, uuid, decimal } from 'drizzle-orm/pg-core'
import { curriculums } from '../../curriculums/entities/curriculum.entity'

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'processing',
  'paid',
  'failed',
  'refunded'
])

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  curriculumId: uuid('curriculum_id').notNull().references(() => curriculums.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: paymentStatusEnum('status').notNull().default('pending'),
  paymentMethod: text('payment_method').notNull(),
  paymentDetails: text('payment_details'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}) 