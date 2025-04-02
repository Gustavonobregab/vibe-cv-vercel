import userRepository from '../repositories/user.repository'
import { NotFoundException, InvalidInputException, DuplicateResourceException } from '../../../shared/errors/http-exception'
import type { CreateFromGoogleDto, UpdateUserDto, UpdateGoogleProfileDto, UserId } from '../types/user.types'
import type { PaginationParams } from '../../../shared/types/common.types'
import { put } from '@vercel/blob'

const createFromGoogle = async (user: CreateFromGoogleDto) => {
  const existingByGoogleId = await userRepository.getByGoogleId(user.googleId)
  if (existingByGoogleId) {
    throw new DuplicateResourceException('User with this Google ID already exists')
  }

  const existingByEmail = await userRepository.getByEmail(user.email)
  if (existingByEmail) {
    if (!existingByEmail.googleId) {
      return await userRepository.update(existingByEmail.id, {
        googleId: user.googleId,
        name: user.name,
        picture: user.picture,
        isActive: user.isActive
      })
    }
    throw new DuplicateResourceException('User with this email already exists')
  }

  const newUser = await userRepository.create(user)
  if (!newUser) {
    throw new InvalidInputException('Failed to create user')
  }
  return newUser
}

const updateGoogleProfile = async (id: UserId, user: UpdateGoogleProfileDto) => {
  const updatedUser = await userRepository.update(id, user)
  if (!updatedUser) {
    throw new NotFoundException('User not found')
  }
  return updatedUser
}

const completeProfile = async (id: UserId, user: UpdateUserDto) => {
  const existingUser = await userRepository.getById(id)
  if (!existingUser) {
    throw new NotFoundException('User not found')
  }

  const updatedUser = await userRepository.update(id, user)
  if (!updatedUser) {
    throw new InvalidInputException('Failed to update profile')
  }
  return updatedUser
}

const getById = async (id: UserId) => {
  const user = await userRepository.getById(id)
  if (!user) {
    throw new NotFoundException('User not found')
  }
  return user
}

const getUserByGoogleId = async (googleId: string) => {
  const user = await userRepository.getByGoogleId(googleId)
  if (!user) {
    throw new NotFoundException('User not found')
  }
  return user
}

const getUserByEmail = async (email: string) => {
  const user = await userRepository.getByEmail(email)
  if (!user) {
    throw new NotFoundException('User not found')
  }
  return user
}

const update = async (id: UserId, user: UpdateUserDto) => {
  const updatedUser = await userRepository.update(id, user)
  if (!updatedUser) {
    throw new NotFoundException('User not found')
  }
  return updatedUser
}

const getPaginated = async (params: PaginationParams) => {
  return await userRepository.getPaginated(params)
}

const uploadCV = async (id: UserId, file: Express.Multer.File) => {
  const user = await userRepository.getById(id)
  if (!user) {
    throw new NotFoundException('User not found')
  }

  const { url } = await put(`users/${id}/cv.pdf`, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
  })

  const updatedUser = await userRepository.update(id, { cvFileUrl: url })
  if (!updatedUser) {
    throw new InvalidInputException('Failed to update CV')
  }

  return updatedUser
}

export default {
  createFromGoogle,
  updateGoogleProfile,
  completeProfile,
  getById,
  getUserByGoogleId,
  getUserByEmail,
  update,
  getPaginated,
  uploadCV
} 