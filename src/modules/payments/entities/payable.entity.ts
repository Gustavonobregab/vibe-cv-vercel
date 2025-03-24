import { pgTable, text, timestamp, integer, decimal, uuid } from 'drizzle-orm/pg-core'
import { curriculums } from '../../curriculums/entities/curriculum.entity'

export const payables = pgTable('payables', {
  id: uuid('id').primaryKey().defaultRandom(),
  curriculumId: uuid('curriculum_id').notNull().references(() => curriculums.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('BRL'),
  status: text('status', { enum: ['pending', 'paid', 'cancelled', 'failed'] }).notNull().default('pending'),
  paymentMethod: text('payment_method', { enum: ['pix', 'credit'] }).notNull(),
  transactionId: text('transaction_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}) 