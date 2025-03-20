import { relations } from 'drizzle-orm'
import { users } from '../../modules/users/entities/user.entity'
import { payables } from '../../modules/payments/entities/payable.entity'
import { curriculums } from '../../modules/curriculums/entities/curriculum.entity'
import { ownerships } from '../../modules/ownerships/entities/ownership.entity'

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  ownerships: many(ownerships),
}))

export const curriculumsRelations = relations(curriculums, ({ many }) => ({
  ownerships: many(ownerships),
}))

export const ownershipsRelations = relations(ownerships, ({ one, many }) => ({
  user: one(users, {
    fields: [ownerships.userId],
    references: [users.id],
  }),
  curriculum: one(curriculums, {
    fields: [ownerships.curriculumId],
    references: [curriculums.id],
  }),
  payables: many(payables),
}))

export const payablesRelations = relations(payables, ({ one }) => ({
  ownership: one(ownerships, {
    fields: [payables.ownershipId],
    references: [ownerships.id],
  }),
}))

// Export all entities
export { users, payables, curriculums, ownerships } 