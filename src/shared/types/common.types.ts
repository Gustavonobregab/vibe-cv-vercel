import { z } from 'zod'
import { createUserSchema, updateUserSchema } from '../../modules/users/zodSchemas/user.schema'
import { createPaymentSchema, updatePaymentSchema } from '../../modules/payments/zodSchemas/payment.schema'
import { createCurriculumSchema, updateCurriculumSchema } from '../../modules/curriculums/zodSchemas/curriculum.schema'
import { createOwnershipSchema } from '../../modules/ownerships/zodSchemas/ownership.schema'

export type CreateUserDto = z.infer<typeof createUserSchema>
export type UpdateUserDto = z.infer<typeof updateUserSchema>

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>
export type UpdatePaymentDto = z.infer<typeof updatePaymentSchema>

export type CreateCurriculumDto = z.infer<typeof createCurriculumSchema>
export type UpdateCurriculumDto = z.infer<typeof updateCurriculumSchema>

export type CreateOwnershipDto = z.infer<typeof createOwnershipSchema>

export type PaginationParams = {
  page?: number
  limit?: number
}

export type PaginatedResponse<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
} 