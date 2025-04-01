import { z } from 'zod'
import { users } from '../entities/user.entity'
import type { InferModel } from 'drizzle-orm'
import { createUserSchema, updateUserSchema } from '../zodSchemas/user.schema'

export type User = {
  id: UserId
  googleId: string
  email: string
  name: string
  picture: string | null
  isActive: boolean
  status: 'active' | 'inactive' | 'suspended'
  phone: string | null
  bio: string | null
  location: string | null
  website: string | null
  company: string | null
  jobTitle: string | null
  cvFileUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export type NewUser = InferModel<typeof users, 'insert'>

// Schema base para usuário
const baseUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  picture: z.string().optional(),
  isActive: z.boolean().default(true),
})

// Schema para criação via Google
export const googleUserSchema = baseUserSchema.extend({
  googleId: z.string(),
})

// Schema para criação manual (se necessário no futuro)
export const manualUserSchema = baseUserSchema.extend({
  password: z.string().min(8),
})

// Schema para atualização
export const updateUserSchema = baseUserSchema.partial()

export type CreateGoogleUserDto = z.infer<typeof googleUserSchema>
export type CreateManualUserDto = z.infer<typeof manualUserSchema>
export type CreateUserDto = z.infer<typeof createUserSchema>
export type UpdateUserDto = z.infer<typeof updateUserSchema>

export type UserId = string
