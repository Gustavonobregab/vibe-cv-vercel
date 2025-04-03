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

/**
 * Gets the current user information
 */
const getCurrentUser = (req: Request, res: Response) => {
  // User is already attached to req by verifyToken middleware
  const user = req.user as PassportUser

  res.status(HttpStatus.OK).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      isActive: user.isActive
    }
  })
}

export default {
  googleAuth,
  googleCallback,
  getCurrentUser
} 