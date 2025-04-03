import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { InvalidCredentialsException } from '../../../shared/errors/http-exception'
import { config } from '../../../shared/config'
import { JwtPayload } from '../types/auth.types'
import authService from '../services/auth.service'

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    throw new InvalidCredentialsException('No token provided')
  }

  try {
    const payload = verify(token, config.jwt.secret) as JwtPayload
    const user = await authService.getUserById(payload.sub)

    if (!user) {
      throw new InvalidCredentialsException('User not found')
    }

    req.user = user
    next()
  } catch (error) {
    throw new InvalidCredentialsException('Invalid token')
  }
} 