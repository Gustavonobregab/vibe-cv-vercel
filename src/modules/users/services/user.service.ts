import userRepository from '../repositories/user.repository'
import { NotFoundException, InvalidInputException, DuplicateResourceException } from '../../../shared/errors/http-exception'
import type { CreateUserDto, UpdateUserDto, UserId } from '../types/user.types'
import type { PaginationParams } from '../../../shared/types/common.types'

const create = async ({ googleId, email, name, picture }: CreateUserDto) => {
  const existingUser = await userRepository.getByGoogleId(googleId)
  if (existingUser) {
    throw new DuplicateResourceException('user')
  }

  const user = await userRepository.create({ googleId, email, name, picture })
  if (!user) {
    throw new InvalidInputException('Failed to create user')
  }
  return user
}

const getById = async (id: UserId) => {
  const user = await userRepository.getById(id)
  if (!user) {
    throw new NotFoundException('User not found')
  }
  return user
}

const getUserByGoogleId = async (googleId: string) => {
  const user = await userRepository.getUserByGoogleId(googleId)
  if (!user) {
    throw new NotFoundException('User not found')
  }

  return user
}

const getUserByEmail = async (email: string) => {
  const user = await userRepository.getUserByEmail(email)
  if (!user) {
    throw new NotFoundException('User not found')
  }

  return user
}

const update = async (id: UserId, { name, picture, isActive }: UpdateUserDto) => {
  const user = await userRepository.update(id, { name, picture, isActive })
  if (!user) {
    throw new NotFoundException('User not found')
  }
  return user
}

const getPaginated = async ({ page, limit }: PaginationParams) => {
  const validatedPage = page ?? 1
  const validatedLimit = limit ?? 10

  if (validatedPage < 1 || validatedLimit < 1) {
    throw new InvalidInputException('Invalid pagination parameters')
  }

  const paginatedUsers = await userRepository.getPaginated({ page: validatedPage, limit: validatedLimit })
  if (!paginatedUsers.items.length) {
    throw new NotFoundException('No users found')
  }

  return paginatedUsers
}

export default {
  create,
  getById,
  getUserByGoogleId,
  getUserByEmail,
  update,
  getPaginated,
} 