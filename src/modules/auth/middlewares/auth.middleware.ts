import { Request, Response, NextFunction } from 'express'
import { verify, JwtPayload } from 'jsonwebtoken'
import { InvalidCredentialsException } from '../../../shared/errors/http-exception'
import { User } from '../../users/types/user.types'

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    throw new InvalidCredentialsException('No token provided')
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as User
    req.user = decoded
    next()
  } catch (error) {
    throw new InvalidCredentialsException('Invalid token')
  }
} 