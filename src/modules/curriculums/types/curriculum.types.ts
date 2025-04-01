import { z } from 'zod'
import { curriculums, curriculumStatusEnum } from '../entities/curriculum.entity'
import type { InferModel } from 'drizzle-orm'
import type { UserId } from '../../users/types/user.types'

export type Curriculum = InferModel<typeof curriculums>
export type NewCurriculum = InferModel<typeof curriculums, 'insert'>
export type CurriculumId = string

export type CurriculumStatus = typeof curriculumStatusEnum._type

export const createCurriculumSchema = z.object({
  userId: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  rawContent: z.string(),
})

export const updateCurriculumSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  rawContent: z.string().optional(),
  status: z.enum(['draft', 'submitted', 'processing', 'completed', 'failed']).optional(),
})

export type CreateCurriculumDto = z.infer<typeof createCurriculumSchema>
export type UpdateCurriculumDto = z.infer<typeof updateCurriculumSchema> 