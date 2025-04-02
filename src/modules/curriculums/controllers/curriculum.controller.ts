import { Request, Response } from 'express'
import curriculumService from '../services/curriculum.service'
import { validateBody, validateParams, validateQuery } from '../../../shared/validators/validate-schema'
import {
  createCurriculumSchema,
  updateCurriculumSchema,
  getCurriculumByIdSchema,
  getCurriculumsByUserIdSchema,
} from '../zodSchemas/curriculum.schema'
import { paginationSchema } from '../../../shared/zodSchemas/common.schema'
import { NotFoundException } from '../../../shared/errors/http-exception'
import { HttpStatus } from '../../../shared/errors/http-status'

const createCurriculum = async (req: Request, res: Response) => {
  const validatedData = validateBody(req).with(createCurriculumSchema)
  const curriculum = await curriculumService.create(validatedData)
  res.status(HttpStatus.CREATED).json(curriculum)
}

const getCurriculumById = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getCurriculumByIdSchema)
  const curriculum = await curriculumService.getById(id)
  if (!curriculum) {
    throw new NotFoundException('Curriculum not found')
  }
  res.status(HttpStatus.OK).json(curriculum)
}

const updateCurriculum = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getCurriculumByIdSchema)
  const validatedData = validateBody(req).with(updateCurriculumSchema)
  const curriculum = await curriculumService.update(id, validatedData)
  if (!curriculum) {
    throw new NotFoundException('Curriculum not found')
  }
  res.status(HttpStatus.OK).json(curriculum)
}

const getCurriculumsByUserId = async (req: Request, res: Response) => {
  const { userId } = validateParams(req).with(getCurriculumsByUserIdSchema)
  const curriculums = await curriculumService.getByUserId(userId)
  res.status(HttpStatus.OK).json(curriculums)
}

const getCurriculumsPaginated = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = validateQuery(req).with(paginationSchema)
  const curriculums = await curriculumService.getPaginated({
    page: Number(page),
    limit: Number(limit)
  })
  res.status(HttpStatus.OK).json(curriculums)
}

export default {
  createCurriculum,
  getCurriculumById,
  updateCurriculum,
  getCurriculumsByUserId,
  getCurriculumsPaginated
} 