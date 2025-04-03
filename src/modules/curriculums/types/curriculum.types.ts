import { z } from 'zod'
import { curriculumStatusEnum } from '../entities/curriculum.entity'
import { createCurriculumSchema, updateCurriculumSchema } from '../zodSchemas/curriculum.schema'
import { CvAnalysisResponse } from '../../ai/types/ai.types'

export type Curriculum = {
  id: string
  userId: string
  title: string
  cvUrl: string
  aiAnalysis?: CvAnalysisResponse | null
  status: CurriculumStatus
  createdAt: Date
  updatedAt: Date
}

export type NewCurriculum = Omit<Curriculum, 'id' | 'createdAt' | 'updatedAt' | 'aiAnalysis'>
export type CurriculumId = string

export type CurriculumStatus = typeof curriculumStatusEnum.enumValues[number]

export type CreateCurriculumDto = z.infer<typeof createCurriculumSchema>
export type UpdateCurriculumDto = z.infer<typeof updateCurriculumSchema> 