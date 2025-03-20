import curriculumRepository from '../repositories/curriculum.repository'
import ownershipService from '../../ownerships/services/ownership.service'
import { NotFoundException, InvalidInputException } from '../../../shared/errors/http-exception'

const create = async (data: { title: string; content: string; rawContent: string; userId: number }) => {
  if (!data.title || !data.content || !data.rawContent || !data.userId) {
    throw new InvalidInputException('Missing required fields')
  }

  const curriculum = await curriculumRepository.createCurriculum({
    title: data.title,
    content: data.content,
    rawContent: data.rawContent,
  })

  if (!curriculum) {
    throw new InvalidInputException('Failed to create curriculum')
  }

  await ownershipService.create({
    userId: data.userId,
    curriculumId: curriculum.id,
  })

  return curriculum
}

const getById = async (id: number) => {
  const curriculum = await curriculumRepository.getCurriculumById(id)
  if (!curriculum) {
    throw new NotFoundException('Curriculum not found')
  }

  return curriculum
}

const update = async (id: number, data: { title?: string; content?: string; rawContent?: string; status?: 'draft' | 'published' | 'archived' }) => {
  const curriculum = await curriculumRepository.updateCurriculum(id, data)
  if (!curriculum) {
    throw new NotFoundException('Curriculum not found')
  }

  return curriculum
}

const getByStatus = async (status: 'draft' | 'published' | 'archived') => {
  const curriculums = await curriculumRepository.getCurriculumsByStatus(status)
  if (!curriculums.length) {
    throw new NotFoundException('No curriculums found with this status')
  }

  return curriculums
}

const getPaginated = async (page: number = 1, limit: number = 10) => {
  if (page < 1 || limit < 1) {
    throw new InvalidInputException('Invalid pagination parameters')
  }

  const paginatedCurriculums = await curriculumRepository.getCurriculumsPaginated(page, limit)
  if (!paginatedCurriculums.items.length) {
    throw new NotFoundException('No curriculums found')
  }

  return paginatedCurriculums
}

export default {
  create,
  getById,
  update,
  getByStatus,
  getPaginated,
} 