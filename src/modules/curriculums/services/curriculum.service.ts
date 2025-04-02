import curriculumRepository from '../repositories/curriculum.repository'
import { NotFoundException, InvalidInputException } from '../../../shared/errors/http-exception'
import type { CreateCurriculumDto, UpdateCurriculumDto, CurriculumId } from '../types/curriculum.types'
import type { UserId } from '../../users/types/user.types'
import type { PaginationParams } from '../../../shared/types/common.types'

const create = async (curriculum: CreateCurriculumDto) => {
  const newCurriculum = await curriculumRepository.create(curriculum)
  if (!newCurriculum) {
    throw new InvalidInputException('Failed to create curriculum')
  }
  return newCurriculum
}

const getById = async (id: CurriculumId) => {
  const curriculum = await curriculumRepository.getById(id)
  if (!curriculum) {
    throw new NotFoundException('Curriculum not found')
  }
  return curriculum
}

const update = async (id: CurriculumId, curriculum: UpdateCurriculumDto) => {
  const updatedCurriculum = await curriculumRepository.update(id, curriculum)
  if (!updatedCurriculum) {
    throw new NotFoundException('Curriculum not found')
  }
  return updatedCurriculum
}

const getByUserId = async (userId: UserId) => {
  const curriculums = await curriculumRepository.getByUserId(userId)
  if (!curriculums.length) {
    throw new NotFoundException('No curriculums found for user')
  }
  return curriculums
}

const getPaginated = async (params: PaginationParams) => {
  const validatedPage = params.page ?? 1
  const validatedLimit = params.limit ?? 10

  if (validatedPage < 1 || validatedLimit < 1) {
    throw new InvalidInputException('Invalid pagination parameters')
  }

  const paginatedCurriculums = await curriculumRepository.getPaginated({ page: validatedPage, limit: validatedLimit })
  if (!paginatedCurriculums.items.length) {
    throw new NotFoundException('No curriculums found')
  }

  return paginatedCurriculums
}

export default {
  create,
  getById,
  update,
  getByUserId,
  getPaginated,
} 