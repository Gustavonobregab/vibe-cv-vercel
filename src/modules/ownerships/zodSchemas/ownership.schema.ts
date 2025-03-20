import { z } from 'zod'
import { idSchema, paginationSchema, dateFieldsSchema, paginatedResponseSchema } from '../../../shared/zodSchemas/common.schema'

// Create ownership request schema
export const createOwnershipSchema = z.object({
  userId: idSchema,
  curriculumId: idSchema,
})

// Get ownership by ID request schema
export const getOwnershipByIdSchema = z.object({
  id: idSchema,
})

// Get ownership by user and curriculum request schema
export const getOwnershipByUserAndCurriculumSchema = z.object({
  userId: idSchema,
  curriculumId: idSchema,
})

// Get ownerships by user request schema
export const getOwnershipsByUserSchema = z.object({
  userId: idSchema,
})

// Get ownerships by curriculum request schema
export const getOwnershipsByCurriculumSchema = z.object({
  curriculumId: idSchema,
})

// Check user owns curriculum request schema
export const checkUserOwnsCurriculumSchema = z.object({
  userId: idSchema,
  curriculumId: idSchema,
})

// Response schemas
export const ownershipResponseSchema = z.object({
  id: idSchema,
  userId: idSchema,
  curriculumId: idSchema,
}).merge(dateFieldsSchema)

export const ownershipListResponseSchema = z.array(ownershipResponseSchema)

export const paginatedOwnershipResponseSchema = paginatedResponseSchema(ownershipResponseSchema) 