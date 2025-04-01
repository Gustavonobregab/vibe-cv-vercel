import { z } from 'zod'
import { User } from '../../users/types/user.types'

export const googleProfileSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  emails: z.array(z.object({ value: z.string().email() })),
  photos: z.array(z.object({ value: z.string().url() })).optional(),
})

export type GoogleProfile = z.infer<typeof googleProfileSchema>

export const authResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    picture: z.string().optional(),
  }),
})

export type AuthResponse = z.infer<typeof authResponseSchema>

export type JwtPayload = {
  sub: string
  email: string
  iat?: number
  exp?: number
}

// PassportUser deve corresponder exatamente ao que o Passport espera
export type PassportUser = Pick<User, 'id' | 'email' | 'name' | 'googleId' | 'picture' | 'isActive'> 