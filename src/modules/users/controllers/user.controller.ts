import { Request, Response } from "express";
import userService from "../services/user.service";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../../shared/validators/validate-schema";
import {
  updateUserSchema,
  getUserByIdSchema,
  getUserByGoogleIdSchema,
  getUserByEmailSchema,
  completeProfileSchema,
} from "../zodSchemas/user.schema";
import { paginationSchema } from "../../../shared/zodSchemas/common.schema";
import { HttpStatus } from "../../../shared/errors/http-status";
import {
  InsufficientPermissionsException,
  InvalidInputException,
} from "../../../shared/errors/http-exception";

/**
 * Get a user by ID
 */
const getUserById = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getUserByIdSchema);

  // Users should only be able to access their own profile
  // unless they have admin privileges (not implemented yet)

  const user = await userService.getById(id, req.user!.id);
  res.status(HttpStatus.OK).json(user);
};

/**
 * Get a user by Google ID (protected route)
 */
const getUserByGoogleId = async (req: Request, res: Response) => {
  // This endpoint should have role-based access control in production
  // Currently we're allowing access but in a real app this would
  // be limited to admins or system processes

  const { googleId } = validateParams(req).with(getUserByGoogleIdSchema);
  const user = await userService.getUserByGoogleId(googleId);
  res.status(HttpStatus.OK).json(user);
};

/**
 * Get a user by email (protected route)
 */
const getUserByEmail = async (req: Request, res: Response) => {
  // This endpoint should have role-based access control in production
  // Currently we're allowing access but in a real app this would
  // be limited to admins or system processes

  const { email } = validateParams(req).with(getUserByEmailSchema);
  const user = await userService.getUserByEmail(email);
  res.status(HttpStatus.OK).json(user);
};

/**
 * Update a user
 */
const updateUser = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getUserByIdSchema);

  // Users should only be able to update their own profile
  const validatedData = validateBody(req).with(updateUserSchema);
  const user = await userService.update(id, req.user!.id, validatedData);
  res.status(HttpStatus.OK).json(user);
};

/**
 * Complete a user profile with additional information
 */
const completeProfile = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getUserByIdSchema);

  // Users should only be able to complete their own profile
  const validatedData = validateBody(req).with(completeProfileSchema);
  const user = await userService.completeProfile(
    id,
    req.user!.id,
    validatedData
  );
  res.status(HttpStatus.OK).json(user);
};

/**
 * Get paginated list of users (admin only)
 */
const getUsersPaginated = async (req: Request, res: Response) => {
  // This endpoint should be admin-only in a production environment
  // For now, we're assuming the current user has admin access

  const validatedQuery = validateQuery(req).with(paginationSchema);
  const users = await userService.getPaginated(validatedQuery);
  res.status(HttpStatus.OK).json(users);
};

export default {
  getUserById,
  getUserByGoogleId,
  getUserByEmail,
  updateUser,
  completeProfile,
  getUsersPaginated,
};
