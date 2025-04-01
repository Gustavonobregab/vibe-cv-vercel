import { z } from 'zod'
import { users } from '../entities/user.entity'
import type { InferModel } from 'drizzle-orm'

export type User = InferModel<typeof users>
export type NewUser = InferModel<typeof users, 'insert'>

export const userSchema = z.object({
  googleId: z.string(),
  email: z.string().email(),
  name: z.string(),
  picture: z.string().optional(),
  isActive: z.boolean().default(true),
})

export type CreateUserDto = z.infer<typeof userSchema>
export type UpdateUserDto = Partial<Omit<CreateUserDto, 'googleId' | 'email'>>

export type UserId = string
