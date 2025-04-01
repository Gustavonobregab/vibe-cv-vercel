import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import authService from '../services/auth.service'
import { HttpStatus } from '../../../shared/errors/http-status'
import { PassportUser } from '../types/auth.types'

const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next)
}

const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', async (err: Error | null, user: PassportUser | null) => {
    if (err) {
      return next(err)
    }

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication failed' })
    }

    const token = authService.generateJwtToken(user)
    res.status(HttpStatus.OK).json({
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    })
  })(req, res, next)
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token format' })
  }

  try {
    const payload = authService.verifyToken(token)
    const user = await authService.getUserById(payload.sub)
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'User not found' })
    }
    req.user = user
    next()
  } catch (error) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' })
  }
}

export default {
  googleAuth,
  googleCallback,
  verifyToken
} 