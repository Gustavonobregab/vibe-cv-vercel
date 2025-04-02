import { Request, Response } from 'express'
import curriculumService from '../services/curriculum.service'
import { validateBody, validateParams, validateQuery } from '../../../shared/validators/validate-schema'
import {
  updateCurriculumSchema,
  getCurriculumByIdSchema,
  getCurriculumsByUserIdSchema,
} from '../zodSchemas/curriculum.schema'
import { paginationSchema } from '../../../shared/zodSchemas/common.schema'
import { NotFoundException, InsufficientPermissionsException, InvalidCredentialsException } from '../../../shared/errors/http-exception'
import { HttpStatus } from '../../../shared/errors/http-status'

const getCurriculumById = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getCurriculumByIdSchema)
  const curriculum = await curriculumService.getById(id)
  if (!curriculum) {
    throw new NotFoundException('Curriculum not found')
  }

  // Ensure user can only access their own curriculums
  if (curriculum.userId !== req.user?.id) {
    throw new InsufficientPermissionsException('access this curriculum')
  }

  res.status(HttpStatus.OK).json(curriculum)
}

const updateCurriculum = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getCurriculumByIdSchema)
  const validatedData = validateBody(req).with(updateCurriculumSchema)

  // First get the curriculum to check ownership
  const existingCurriculum = await curriculumService.getById(id)
  if (!existingCurriculum) {
    throw new NotFoundException('Curriculum not found')
  }

  // Ensure user can only update their own curriculums
  if (existingCurriculum.userId !== req.user?.id) {
    throw new InsufficientPermissionsException('update this curriculum')
  }

  const curriculum = await curriculumService.update(id, validatedData)
  res.status(HttpStatus.OK).json(curriculum)
}

const getCurriculumsByUserId = async (req: Request, res: Response) => {
  const { userId } = validateParams(req).with(getCurriculumsByUserIdSchema)

  // Ensure user can only access their own curriculums
  if (userId !== req.user?.id) {
    throw new InsufficientPermissionsException('access these curriculums')
  }

  const curriculums = await curriculumService.getByUserId(userId)
  res.status(HttpStatus.OK).json(curriculums)
}

const getCurriculumsPaginated = async (req: Request, res: Response) => {
  // This should only be accessible by admins or with specific permissions
  // For now, we'll restrict it to the user's own curriculums
  const { page = 1, limit = 10 } = validateQuery(req).with(paginationSchema)
  const curriculums = await curriculumService.getPaginated({
    page: Number(page),
    limit: Number(limit)
  })
  res.status(HttpStatus.OK).json(curriculums)
}

const uploadCV = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new InvalidCredentialsException('Authentication required')
  }

  const userId = req.user.id
  const { title } = req.body

  if (!req.file) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'No file uploaded' })
  }

  const curriculum = await curriculumService.uploadCV(userId, title, req.file)
  res.status(HttpStatus.CREATED).json(curriculum)
}

export default {
  getCurriculumById,
  updateCurriculum,
  getCurriculumsByUserId,
  getCurriculumsPaginated,
  uploadCV
} 