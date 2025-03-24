import { relations } from 'drizzle-orm'
import { users } from '../../modules/users/entities/user.entity'
import { payables } from '../../modules/payments/entities/payable.entity'
import { curriculums } from '../../modules/curriculums/entities/curriculum.entity'

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  curriculums: many(curriculums),
}))

export const curriculumsRelations = relations(curriculums, ({ one, many }) => ({
  user: one(users, {
    fields: [curriculums.userId],
    references: [users.id],
  }),
  payables: many(payables),
}))

export const payablesRelations = relations(payables, ({ one }) => ({
  curriculum: one(curriculums, {
    fields: [payables.curriculumId],
    references: [curriculums.id],
  }),
}))

// Export all entities
export { users, payables, curriculums } 