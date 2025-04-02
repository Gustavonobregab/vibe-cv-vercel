import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import jwt, { SignOptions } from 'jsonwebtoken'
import userService from '../../users/services/user.service'
import { GoogleProfile, JwtPayload, PassportUser } from '../types/auth.types'
import { config } from '../../../shared/config'
import { User } from '../../users/types/user.types'

const setupPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
        scope: ['email', 'profile'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await createUser(profile as GoogleProfile)
          done(null, user)
        } catch (error) {
          done(error as Error)
        }
      }
    )
  )

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await userService.getById(id)
      if (!user) {
        return done(new Error('User not found'))
      }
      done(null, user as PassportUser)
    } catch (error) {
      done(error as Error)
    }
  })
}

const createUser = async (profile: GoogleProfile): Promise<User> => {
  const { id, displayName, emails, photos } = profile
  const email = emails[0].value
  const picture = photos?.[0]?.value

  // Find or create user
  const existingUser = await userService.getUserByGoogleId(id)
  if (!existingUser) {
    return await userService.createFromGoogle({
      googleId: id,
      email,
      name: displayName,
      picture,
      isActive: true
    })
  }

  return existingUser
}

const generateJwtToken = (user: PassportUser): string => {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
  }
  const options: SignOptions = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, config.jwt.secret, options)
}

const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload
}

const getUserById = async (id: string): Promise<PassportUser | null> => {
  const user = await userService.getById(id)
  if (!user) return null
  return user as PassportUser
}

export default {
  setupPassport,
  createUser,
  generateJwtToken,
  verifyToken,
  getUserById
} 