import { z } from 'zod'
import { users } from '../entities/user.entity'
import { createFromGoogleSchema, updateUserSchema, updateGoogleProfileSchema } from '../zodSchemas/user.schema'

export type User = typeof users.$inferSelect

export type CreateFromGoogleDto = z.infer<typeof createFromGoogleSchema>
export type UpdateUserDto = z.infer<typeof updateUserSchema>
export type UpdateGoogleProfileDto = z.infer<typeof updateGoogleProfileSchema>
export type UserId = string
