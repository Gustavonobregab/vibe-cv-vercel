import userRepository from "../repositories/user.repository";
import {
  NotFoundException,
  InvalidInputException,
  DuplicateResourceException,
  InsufficientPermissionsException,
} from "../../../shared/errors/http-exception";
import type {
  CreateFromGoogleDto,
  UpdateUserDto,
  UpdateGoogleProfileDto,
  UserId,
} from "../types/user.types";
import type { PaginationParams } from "../../../shared/types/common.types";

/**
 * Create a new user from Google OAuth data
 * @param user The user data from Google
 * @returns The created or updated user
 */
const createFromGoogle = async (user: CreateFromGoogleDto) => {
  // Validate input
  if (!user.googleId || !user.email || !user.name) {
    throw new InvalidInputException("Missing required user data");
  }

  // Check if user with this Google ID already exists
  const existingByGoogleId = await userRepository.getByGoogleId(user.googleId);
  if (existingByGoogleId) {
    throw new DuplicateResourceException(
      "User with this Google ID already exists"
    );
  }

  // Check if user with this email already exists but doesn't have a Google ID
  const existingByEmail = await userRepository.getByEmail(user.email);
  if (existingByEmail) {
    if (!existingByEmail.googleId) {
      // Update existing user with Google ID
      return await userRepository.update(existingByEmail.id, {
        googleId: user.googleId,
        name: user.name,
        picture: user.picture,
        isActive: user.isActive,
      });
    }
    throw new DuplicateResourceException("User with this email already exists");
  }

  // Create new user
  const newUser = await userRepository.create(user);
  if (!newUser) {
    throw new InvalidInputException("Failed to create user");
  }
  return newUser;
};

/**
 * Update a user's Google profile data
 * @param id User ID
 * @param user Updated Google profile data
 * @returns The updated user
 */
const updateGoogleProfile = async (
  id: UserId,
  userId: UserId,
  user: UpdateGoogleProfileDto
) => {
  if (!id) {
    throw new InvalidInputException("User ID is required");
  }

  // Validate that user exists
  await getById(id, userId);

  // Update user
  const updatedUser = update(id, userId, user);

  return updatedUser;
};

/**
 * Complete a user's profile with additional information
 * @param id User ID
 * @param user Profile data to update
 * @returns The updated user
 */
const completeProfile = async (
  id: UserId,
  userId: UserId,
  user: UpdateUserDto
) => {
  if (!id) {
    throw new InvalidInputException("User ID is required");
  }

  // Validate that user exists
  getById(id, userId);

  // Update user profile
  const updatedUser = await update(id, userId, user);

  return updatedUser;
};

/**
 * Get a user by ID
 * @param id User ID
 * @returns The user
 */
const getById = async (id: UserId, userId: UserId) => {
  if (!id) {
    throw new InvalidInputException("User ID is required");
  }

  if (id !== userId) {
    throw new InsufficientPermissionsException("access this user profile");
  }

  const user = await userRepository.getById(id);
  if (!user) {
    throw new NotFoundException("User not found");
  }
  return user;
};

/**
 * Get a user by Google ID
 * @param googleId Google ID
 * @returns The user
 */
const getUserByGoogleId = async (googleId: string) => {
  if (!googleId) {
    throw new InvalidInputException("Google ID is required");
  }

  const user = await userRepository.getByGoogleId(googleId);
  if (!user) {
    throw new NotFoundException("User not found");
  }
  return user;
};

/**
 * Get a user by email
 * @param email Email address
 * @returns The user
 */
const getUserByEmail = async (email: string) => {
  if (!email) {
    throw new InvalidInputException("Email is required");
  }

  const user = await userRepository.getByEmail(email);
  if (!user) {
    throw new NotFoundException("User not found");
  }
  return user;
};

/**
 * Update a user's information
 * @param id User ID
 * @param user User data to update
 * @returns The updated user
 */
const update = async (id: UserId, userId: UserId, user: UpdateUserDto) => {
  if (!id) {
    throw new InvalidInputException("User ID is required");
  }

  // Validate that user exists
  await getById(id, userId);

  const updatedUser = await userRepository.update(id, user);
  if (!updatedUser) {
    throw new NotFoundException("User not found");
  }
  return updatedUser;
};

/**
 * Get a paginated list of users
 * @param params Pagination parameters
 * @returns List of users
 */
const getPaginated = async (params: PaginationParams) => {
  // Validate pagination parameters
  const validatedPage = params.page ?? 1;
  const validatedLimit = params.limit ?? 10;

  if (validatedPage < 1 || validatedLimit < 1) {
    throw new InvalidInputException("Invalid pagination parameters");
  }

  const users = await userRepository.getPaginated({
    page: validatedPage,
    limit: validatedLimit,
  });

  if (!users || users.items.length === 0) {
    throw new NotFoundException("No users found");
  }

  return users;
};

export default {
  createFromGoogle,
  updateGoogleProfile,
  completeProfile,
  getById,
  getUserByGoogleId,
  getUserByEmail,
  update,
  getPaginated,
};
