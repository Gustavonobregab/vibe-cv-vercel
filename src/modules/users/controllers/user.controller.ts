import { Request, Response } from 'express'
import userService from '../services/user.service'
import { validateBody, validateParams, validateQuery } from '../../../shared/validators/validate-schema'
import {
  updateUserSchema,
  getUserByIdSchema,
  getUserByGoogleIdSchema,
  getUserByEmailSchema,
  completeProfileSchema
} from '../zodSchemas/user.schema'
import { paginationSchema } from '../../../shared/zodSchemas/common.schema'
import { HttpStatus } from '../../../shared/errors/http-status'

const getUserById = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getUserByIdSchema)
  const user = await userService.getById(id)
  res.status(HttpStatus.OK).json(user)
}

const getUserByGoogleId = async (req: Request, res: Response) => {
  const { googleId } = validateParams(req).with(getUserByGoogleIdSchema)
  const user = await userService.getUserByGoogleId(googleId)
  res.status(HttpStatus.OK).json(user)
}

const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = validateParams(req).with(getUserByEmailSchema)
  const user = await userService.getUserByEmail(email)
  res.status(HttpStatus.OK).json(user)
}

const updateUser = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getUserByIdSchema)
  const validatedData = validateBody(req).with(updateUserSchema)
  const user = await userService.update(id, validatedData)
  res.status(HttpStatus.OK).json(user)
}

const completeProfile = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getUserByIdSchema)
  const validatedData = validateBody(req).with(completeProfileSchema)
  const user = await userService.completeProfile(id, validatedData)
  res.status(HttpStatus.OK).json(user)
}

const getUsersPaginated = async (req: Request, res: Response) => {
  const validatedQuery = validateQuery(req).with(paginationSchema)
  const users = await userService.getPaginated(validatedQuery)
  res.status(HttpStatus.OK).json(users)
}

const uploadCV = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'No file uploaded' })
  }

  const { id } = validateParams(req).with(getUserByIdSchema)
  const user = await userService.uploadCV(id, req.file)
  res.status(HttpStatus.OK).json(user)
}

export default {
  getUserById,
  getUserByGoogleId,
  getUserByEmail,
  updateUser,
  completeProfile,
  getUsersPaginated,
  uploadCV
} 