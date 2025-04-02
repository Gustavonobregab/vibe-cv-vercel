import { z } from 'zod'
import { idSchema, dateFieldsSchema } from '../../../shared/zodSchemas/common.schema'

// User status enum
export const userStatusEnum = z.enum(['active', 'inactive', 'suspended'])

// Create user from Google auth schema
export const createFromGoogleSchema = z.object({
  googleId: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1).max(255),
  picture: z.string().url().optional(),
  isActive: z.boolean().default(true),
})

// Profile completion schema
export const completeProfileSchema = z.object({
  phone: z.string().min(10).max(15).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional(),
  company: z.string().max(100).optional(),
  jobTitle: z.string().max(100).optional(),
  cvFileUrl: z.string().url().optional(),
})

// Update Google profile schema
export const updateGoogleProfileSchema = z.object({
  googleId: z.string().min(1),
  name: z.string().min(1).max(255),
  picture: z.string().url().optional(),
  isActive: z.boolean().optional(),
})

// Update user request schema
export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  picture: z.string().url().optional(),
  isActive: z.boolean().optional(),
  status: userStatusEnum.optional(),
}).merge(completeProfileSchema)

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
  phone: z.string().nullable(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  website: z.string().nullable(),
  company: z.string().nullable(),
  jobTitle: z.string().nullable(),
  cvFileUrl: z.string().nullable(),
}).merge(dateFieldsSchema)

export const userListResponseSchema = z.array(userResponseSchema) 