import { z } from 'zod'
import { curriculums, curriculumStatusEnum } from '../entities/curriculum.entity'
import type { InferModel } from 'drizzle-orm'
import type { UserId } from '../../users/types/user.types'
import { createCurriculumSchema, updateCurriculumSchema } from '../zodSchemas/curriculum.schema'

export type Curriculum = InferModel<typeof curriculums>
export type NewCurriculum = InferModel<typeof curriculums, 'insert'>
export type CurriculumId = string

export type CurriculumStatus = typeof curriculumStatusEnum.enumValues[number]

export type CreateCurriculumDto = z.infer<typeof createCurriculumSchema>
export type UpdateCurriculumDto = z.infer<typeof updateCurriculumSchema> 