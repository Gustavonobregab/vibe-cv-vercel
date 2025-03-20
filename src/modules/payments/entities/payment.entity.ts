import { integer, numeric, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { users } from '../../users/entities/user.entity'

export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'processing', 'completed', 'failed', 'refunded'])
export const paymentMethodEnum = pgEnum('payment_method', ['credit_card', 'debit_card', 'bank_transfer', 'paypal'])

export const payments = pgTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  transactionId: text('transaction_id').notNull().unique(),
  status: paymentStatusEnum('status').notNull().default('pending'),
  statusReason: text('status_reason'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}) 