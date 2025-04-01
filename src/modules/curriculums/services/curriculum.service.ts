import curriculumRepository from '../repositories/curriculum.repository'
import { NotFoundException, InvalidInputException } from '../../../shared/errors/http-exception'
import type { CreateCurriculumDto, UpdateCurriculumDto, CurriculumId } from '../types/curriculum.types'
import type { UserId } from '../../users/types/user.types'
import type { PaginationParams } from '../../../shared/types/common.types'

const create = async ({ userId, title, content, rawContent }: CreateCurriculumDto) => {
  const curriculum = await curriculumRepository.create({ userId, title, content, rawContent })
  if (!curriculum) {
    throw new InvalidInputException('Failed to create curriculum')
  }
  return curriculum
}

const getById = async (id: CurriculumId) => {
  const curriculum = await curriculumRepository.getById(id)
  if (!curriculum) {
    throw new NotFoundException('Curriculum not found')
  }
  return curriculum
}

const update = async (id: CurriculumId, { title, content, rawContent, status }: UpdateCurriculumDto) => {
  const curriculum = await curriculumRepository.update(id, { title, content, rawContent, status })
  if (!curriculum) {
    throw new NotFoundException('Curriculum not found')
  }
  return curriculum
}

const getByUserId = async (userId: UserId) => {
  const curriculums = await curriculumRepository.getByUserId(userId)
  if (!curriculums.length) {
    throw new NotFoundException('No curriculums found for user')
  }
  return curriculums
}

const getPaginated = async ({ page, limit }: PaginationParams) => {
  const validatedPage = page ?? 1
  const validatedLimit = limit ?? 10

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