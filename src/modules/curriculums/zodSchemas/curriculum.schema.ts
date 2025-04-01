import { z } from 'zod'
import { idSchema, dateFieldsSchema, paginatedResponseSchema } from '../../../shared/zodSchemas/common.schema'

// Curriculum status enum
export const curriculumStatusEnum = z.enum(['draft', 'submitted', 'processing', 'completed', 'failed'])

// Create curriculum request schema
export const createCurriculumSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  rawContent: z.string().min(1),
  userId: idSchema,
})

// Update curriculum request schema
export const updateCurriculumSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  rawContent: z.string().min(1).optional(),
  status: curriculumStatusEnum.optional(),
})

// Get curriculum by ID request schema
export const getCurriculumByIdSchema = z.object({
  id: idSchema,
})

// Get curriculums by status request schema
export const getCurriculumsByStatusSchema = z.object({
  status: curriculumStatusEnum,
})

// Response schemas
export const curriculumResponseSchema = z.object({
  id: idSchema,
  title: z.string(),
  content: z.string(),
  rawContent: z.string(),
  status: curriculumStatusEnum,
}).merge(dateFieldsSchema)

export const curriculumListResponseSchema = z.array(curriculumResponseSchema)

export const paginatedCurriculumResponseSchema = paginatedResponseSchema(curriculumResponseSchema) 