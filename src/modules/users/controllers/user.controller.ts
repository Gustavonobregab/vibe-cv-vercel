import { Request, Response } from 'express'
import userService from '../services/user.service'
import { validateBody, validateParams, validateQuery } from '../../../shared/validators/validate-schema'
import {
  createUserSchema,
  updateUserSchema,
  getUserByIdSchema,
  getUserByGoogleIdSchema,
  getUserByEmailSchema,
  completeProfileSchema
} from '../zodSchemas/user.schema'
import { paginationSchema } from '../../../shared/zodSchemas/common.schema'
import { NotFoundException } from '../../../shared/errors/http-exception'
import { put } from '@vercel/blob'

const createUser = async (req: Request, res: Response) => {
  const validatedData = validateBody(req).with(createUserSchema)
  const user = await userService.create(validatedData)
  res.status(201).json(user)
}

const getUserById = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getUserByIdSchema)
  const user = await userService.getById(id)
  if (!user) {
    throw new NotFoundException('User not found')
  }
  res.json(user)
}

const getUserByGoogleId = async (req: Request, res: Response) => {
  const { googleId } = validateParams(req).with(getUserByGoogleIdSchema)
  const user = await userService.getUserByGoogleId(googleId)
  if (!user) {
    throw new NotFoundException('User not found')
  }
  res.json(user)
}

const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = validateParams(req).with(getUserByEmailSchema)
  const user = await userService.getUserByEmail(email)
  if (!user) {
    throw new NotFoundException('User not found')
  }
  res.json(user)
}

const updateUser = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getUserByIdSchema)
  const validatedData = validateBody(req).with(updateUserSchema)
  const user = await userService.update(id, validatedData)
  if (!user) {
    throw new NotFoundException('User not found')
  }
  res.json(user)
}

const completeProfile = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getUserByIdSchema)
  const validatedData = validateBody(req).with(completeProfileSchema)
  const user = await userService.completeProfile(id, validatedData)
  res.json(user)
}

const getUsersPaginated = async (req: Request, res: Response) => {
  const validatedQuery = validateQuery(req).with(paginationSchema)
  const users = await userService.getPaginated(validatedQuery)
  res.json(users)
}

const uploadCV = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  const { id } = validateParams(req).with(getUserByIdSchema)
  const user = await userService.getById(id)

  if (!user) {
    throw new NotFoundException('User not found')
  }

  // Upload file to Vercel Blob
  const { url } = await put(`users/${id}/cv.pdf`, req.file.buffer, {
    access: 'public',
    contentType: req.file.mimetype,
  })

  // Update user with CV URL
  const updatedUser = await userService.update(id, { cvFileUrl: url })
  res.json(updatedUser)
}

export default {
  createUser,
  getUserById,
  getUserByGoogleId,
  getUserByEmail,
  updateUser,
  completeProfile,
  getUsersPaginated,
  uploadCV
} 