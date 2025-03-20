import userRepository from '../repositories/user.repository'
import { NotFoundException, InvalidInputException, DuplicateResourceException } from '../../../shared/errors/http-exception'

const createUser = async (data: { googleId: string; email: string; name: string; picture?: string }) => {
  const existingUser = await userRepository.getUserByGoogleId(data.googleId)
  if (existingUser) {
    throw new DuplicateResourceException('user')
  }

  const user = await userRepository.createUser(data)
  if (!user) {
    throw new InvalidInputException('Failed to create user')
  }

  return user
}

const getUserById = async (id: number) => {
  const user = await userRepository.getUserById(id)
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

const updateUser = async (id: number, data: { name?: string; picture?: string; isActive?: boolean }) => {
  const user = await userRepository.updateUser(id, data)
  if (!user) {
    throw new NotFoundException('User not found')
  }

  return user
}

export default {
  createUser,
  getUserById,
  getUserByGoogleId,
  getUserByEmail,
  updateUser,
} 