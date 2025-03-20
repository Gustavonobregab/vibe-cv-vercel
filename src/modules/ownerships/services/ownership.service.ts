import { NotFoundException, InvalidInputException } from '../../../shared/errors/http-exception'
import ownershipRepository from '../repositories/ownership.repository'

const create = async (data: { userId: number; curriculumId: number }) => {
  if (!data.userId || !data.curriculumId) {
    throw new InvalidInputException('Missing required fields')
  }

  const ownership = await ownershipRepository.create(data)
  if (!ownership) {
    throw new InvalidInputException('Failed to create ownership record')
  }

  return ownership
}

const getByCurriculumId = async (curriculumId: number) => {
  const ownership = await ownershipRepository.getByCurriculumId(curriculumId)
  if (!ownership) {
    throw new NotFoundException('Ownership not found')
  }
  return ownership
}

const getByUserId = async (userId: number) => {
  const ownerships = await ownershipRepository.getByUserId(userId)
  if (!ownerships.length) {
    throw new NotFoundException('No ownerships found for user')
  }
  return ownerships
}

const getByUserAndCurriculum = async (userId: number, curriculumId: number) => {
  const ownership = await ownershipRepository.getByUserAndCurriculum(userId, curriculumId)
  if (!ownership) {
    throw new NotFoundException('Ownership not found')
  }
  return ownership
}

const getCurriculumsByUser = async (userId: number) => {
  const curriculums = await ownershipRepository.getCurriculumsByUser(userId)
  if (!curriculums.length) {
    throw new NotFoundException('No curriculums found for user')
  }
  return curriculums
}

const getAllCurriculumsPaginated = async (page: number = 1, limit: number = 10) => {
  if (page < 1 || limit < 1) {
    throw new InvalidInputException('Invalid pagination parameters')
  }

  const paginatedCurriculums = await ownershipRepository.getAllCurriculumsPaginated(page, limit)
  if (!paginatedCurriculums.items.length) {
    throw new NotFoundException('No curriculums found')
  }
  return paginatedCurriculums
}

const getById = async (id: number) => {
  const ownership = await ownershipRepository.getOwnershipById(id)
  if (!ownership) {
    throw new NotFoundException('Ownership not found')
  }
  return ownership
}

const checkUserOwnsCurriculum = async (userId: number, curriculumId: number) => {
  return await ownershipRepository.checkUserOwnsCurriculum(userId, curriculumId)
}

export default {
  create,
  getByCurriculumId,
  getByUserId,
  getByUserAndCurriculum,
  getCurriculumsByUser,
  getAllCurriculumsPaginated,
  getById,
  checkUserOwnsCurriculum,
} 