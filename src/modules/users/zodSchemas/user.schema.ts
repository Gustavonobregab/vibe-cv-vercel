import { z } from 'zod'
import { idSchema, dateFieldsSchema } from '../../../shared/zodSchemas/common.schema'

// User status enum
export const userStatusEnum = z.enum(['active', 'inactive', 'suspended'])

// Create user request schema (for Google auth)
export const createUserSchema = z.object({
  googleId: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1).max(255),
  picture: z.string().url().optional(),
  isActive: z.boolean().default(true),
})

// Update user request schema
export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  picture: z.string().url().optional(),
  isActive: z.boolean().optional(),
  status: userStatusEnum.optional(),
})

// Get user by ID request schema
export const getUserByIdSchema = z.object({
  id: idSchema,
})

// Get user by Google ID request schema
export const getUserByGoogleIdSchema = z.object({
  googleId: z.string().min(1),
})

// Get user by email request schema
export const getUserByEmailSchema = z.object({
  email: z.string().email(),
})

// Response schemas
export const userResponseSchema = z.object({
  id: idSchema,
  googleId: z.string(),
  email: z.string(),
  name: z.string(),
  picture: z.string().nullable(),
  isActive: z.boolean(),
  status: userStatusEnum,
}).merge(dateFieldsSchema)

export const userListResponseSchema = z.array(userResponseSchema) 