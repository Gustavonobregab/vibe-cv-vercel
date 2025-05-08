import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt, { SignOptions } from "jsonwebtoken";
import userService from "../../users/services/user.service";
import { GoogleProfile, JwtPayload, PassportUser } from "../types/auth.types";
import { config } from "../../../shared/config";
import { User } from "../../users/types/user.types";
import {
  InvalidCredentialsException,
  InvalidInputException,
} from "../../../shared/errors/http-exception";
import userRepository from "@/modules/users/repositories/user.repository";

/**
 * Sets up passport for Google OAuth
 */
const setupPassport = () => {
  // Validate that all required env variables are present
  if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_CALLBACK_URL
  ) {
    throw new InvalidInputException("Missing Google OAuth configuration");
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ["email", "profile"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await createUser(profile as GoogleProfile);
          done(null, user);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await userRepository.getById(id);
      if (!user) {
        return done(new Error("User not found"));
      }
      done(null, user as PassportUser);
    } catch (error) {
      done(error as Error);
    }
  });
};

/**
 * Creates or finds a user from Google profile
 */
const createUser = async (profile: GoogleProfile): Promise<User> => {
  if (!profile || !profile.id || !profile.emails || !profile.emails.length) {
    throw new InvalidInputException("Invalid Google profile data");
  }

  const { id, displayName, emails, photos } = profile;
  const email = emails[0].value;
  const picture = photos?.[0]?.value;

  // Find or create user
  const existingUser = await userService.getUserByGoogleId(id);
  if (!existingUser) {
    return await userService.createFromGoogle({
      googleId: id,
      email,
      name: displayName,
      picture,
      isActive: true,
    });
  }

  return existingUser;
};

/**
 * Generates a JWT token for the user
 */
const generateJwtToken = (user: PassportUser): string => {
  if (!user || !user.id || !user.email) {
    throw new InvalidInputException("Invalid user data for token generation");
  }

  const payload: JwtPayload = {
    sub: user.id,
    role: user.role,
    email: user.email,
  };

  const options: SignOptions = {
    expiresIn: "1d", // Default to 1 day
  };

  return jwt.sign(payload, config.jwt.secret, options);
};

/**
 * Verifies a JWT token
 */
const verifyToken = (token: string) => {
  if (!token) {
    throw new InvalidInputException("Token is required");
  }

  return jwt.verify(token, config.jwt.secret);
};

/**
 * Gets a user by ID
 */
const getUserById = async (id: string, userId: string) => {
  if (!id) {
    throw new InvalidInputException("User ID is required");
  }

  const user = await userService.getById(id, userId);
  if (!user) {
    throw new InvalidCredentialsException("User not found");
  }
  return user;
};

export default {
  setupPassport,
  createUser,
  generateJwtToken,
  verifyToken,
  getUserById,
};
