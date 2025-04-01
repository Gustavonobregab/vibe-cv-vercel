import userRepository from '../repositories/user.repository'
import { NotFoundException, InvalidInputException, DuplicateResourceException } from '../../../shared/errors/http-exception'
import type { CreateGoogleUserDto, UpdateUserDto, UserId } from '../types/user.types'
import type { PaginationParams } from '../../../shared/types/common.types'
import { uploadToStorage } from '../../../shared/services/storage.service'

// Método específico para criar usuário via Google
const createFromGoogle = async (data: CreateGoogleUserDto) => {
  // 1. Verifica se já existe usuário com este googleId
  const existingByGoogleId = await userRepository.getByGoogleId(data.googleId)
  if (existingByGoogleId) {
    throw new DuplicateResourceException('User with this Google ID already exists')
  }

  // 2. Verifica se já existe usuário com este email
  const existingByEmail = await userRepository.getByEmail(data.email)
  if (existingByEmail) {
    // Se existe usuário com este email mas sem googleId, atualiza
    if (!existingByEmail.googleId) {
      return await userRepository.update(existingByEmail.id, {
        googleId: data.googleId,
        name: data.name,
        picture: data.picture,
        isActive: true
      })
    }
    throw new DuplicateResourceException('User with this email already exists')
  }

  // 3. Cria novo usuário
  const user = await userRepository.create(data)
  if (!user) {
    throw new InvalidInputException('Failed to create user')
  }
  return user
}

// Método específico para atualizar dados do Google
const updateGoogleProfile = async (id: UserId, data: Pick<CreateGoogleUserDto, 'email' | 'name' | 'picture'>) => {
  const user = await userRepository.update(id, data)
  if (!user) {
    throw new NotFoundException('User not found')
  }
  return user
}

// Método específico para completar perfil
const completeProfile = async (id: UserId, data: UpdateUserDto) => {
  const user = await userRepository.getById(id)
  if (!user) {
    throw new NotFoundException('User not found')
  }

  // Atualiza o perfil com os dados fornecidos
  const updatedUser = await userRepository.update(id, data)
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

const getByGoogleId = async (googleId: string) => {
  const user = await userRepository.getByGoogleId(googleId)
  if (!user) {
    throw new NotFoundException('User not found')
  }
  return user
}

const getByEmail = async (email: string) => {
  const user = await userRepository.getByEmail(email)
  if (!user) {
    throw new NotFoundException('User not found')
  }
  return user
}

const update = async (id: UserId, data: UpdateUserDto) => {
  const user = await userRepository.update(id, data)
  if (!user) {
    throw new NotFoundException('User not found')
  }
  return user
}

const getPaginated = async ({ page, limit }: PaginationParams) => {
  return await userRepository.getPaginated({ page, limit })
}

const uploadCV = async (id: UserId, file: Express.Multer.File) => {
  const user = await userRepository.getById(id)
  if (!user) {
    throw new NotFoundException('User not found')
  }

  // Upload file to storage (e.g., S3, Google Cloud Storage)
  const fileUrl = await uploadToStorage(file, `users/${id}/cv.pdf`)

  // Update user with CV file URL
  const updatedUser = await userRepository.update(id, { cvFileUrl: fileUrl })
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
  getByGoogleId,
  getByEmail,
  update,
  getPaginated,
  uploadCV
} 