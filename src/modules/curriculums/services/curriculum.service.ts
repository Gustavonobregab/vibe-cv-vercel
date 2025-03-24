import curriculumRepository from '../repositories/curriculum.repository'
import { NotFoundException, InvalidInputException } from '../../../shared/errors/http-exception'

const create = async (data: { title: string; content: string; rawContent: string; userId: string }) => {
  if (!data.title || !data.content || !data.rawContent || !data.userId) {
    throw new InvalidInputException('Missing required fields')
  }

  const curriculum = await curriculumRepository.createCurriculum({
    title: data.title,
    content: data.content,
    rawContent: data.rawContent,
    userId: data.userId,
  })

  if (!curriculum) {
    throw new InvalidInputException('Failed to create curriculum')
  }

  return curriculum
}

const getById = async (id: string) => {
  const curriculum = await curriculumRepository.getCurriculumById(id)
  if (!curriculum) {
    throw new NotFoundException('Curriculum not found')
  }

  return curriculum
}

const update = async (id: string, data: { title?: string; content?: string; rawContent?: string; status?: 'draft' | 'published' | 'archived' }) => {
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

const getByUserId = async (userId: string) => {
  const curriculums = await curriculumRepository.getCurriculumsByUserId(userId)
  if (!curriculums.length) {
    throw new NotFoundException('No curriculums found for this user')
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
  getByUserId,
  getPaginated,
} 