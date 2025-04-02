import { relations } from 'drizzle-orm'
import { users } from '../../modules/users/entities/user.entity'
import { curriculums } from '../../modules/curriculums/entities/curriculum.entity'
import { payments } from '../../modules/payments/entities/payment.entity'

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  curriculums: many(curriculums),
}))

export const curriculumsRelations = relations(curriculums, ({ one, many }) => ({
  user: one(users, {
    fields: [curriculums.userId],
    references: [users.id],
  }),
  payments: many(payments),
}))

export const paymentsRelations = relations(payments, ({ one }) => ({
  curriculum: one(curriculums, {
    fields: [payments.curriculumId],
    references: [curriculums.id],
  }),
}))

// Export all entities
export { users, payments, curriculums } 