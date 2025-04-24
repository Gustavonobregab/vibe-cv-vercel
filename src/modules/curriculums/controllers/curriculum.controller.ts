import { Request, Response } from "express";
import curriculumService from "../services/curriculum.service";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../../shared/validators/validate-schema";
import {
  updateCurriculumSchema,
  getCurriculumByIdSchema,
  getCurriculumsByUserIdSchema,
} from "../zodSchemas/curriculum.schema";
import { paginationSchema } from "../../../shared/zodSchemas/common.schema";
import {
  NotFoundException,
  InsufficientPermissionsException,
  InvalidInputException,
} from "../../../shared/errors/http-exception";
import { HttpStatus } from "../../../shared/errors/http-status";

/**
 * Get a curriculum by ID
 */
const getCurriculumById = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getCurriculumByIdSchema);
  const curriculum = await curriculumService.getById(id);

  // Ensure user can only access their own curriculums
  if (curriculum.userId !== req.user?.id) {
    throw new InsufficientPermissionsException("access this curriculum");
  }

  res.status(HttpStatus.OK).json(curriculum);
};

/**
 * Update a curriculum
 */
const updateCurriculum = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getCurriculumByIdSchema);
  const validatedData = validateBody(req).with(updateCurriculumSchema);

  // First get the curriculum to check ownership
  const existingCurriculum = await curriculumService.getById(id);
  if (!existingCurriculum) {
    throw new NotFoundException("Curriculum not found");
  }

  // Ensure user can only update their own curriculums
  if (existingCurriculum.userId !== req.user?.id) {
    throw new InsufficientPermissionsException("update this curriculum");
  }

  const curriculum = await curriculumService.update(id, validatedData);
  res.status(HttpStatus.OK).json(curriculum);
};

/**
 * Get curriculums by user ID
 */
const getCurriculumsByUserId = async (req: Request, res: Response) => {
  const { userId } = validateParams(req).with(getCurriculumsByUserIdSchema);

  // Ensure user can only access their own curriculums
  if (userId !== req.user?.id) {
    throw new InsufficientPermissionsException("access these curriculums");
  }

  const curriculums = await curriculumService.getByUserId(userId);
  res.status(HttpStatus.OK).json(curriculums);
};

/**
 * Get paginated curriculums
 */
const getCurriculumsPaginated = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new InvalidInputException("Authentication required");
  }

  // This should only be accessible by admins or with specific permissions
  // For now, we'll restrict it to the user's own curriculums
  const { page = 1, limit = 10 } = validateQuery(req).with(paginationSchema);
  const curriculums = await curriculumService.getPaginated({
    page: Number(page),
    limit: Number(limit),
  });
  res.status(HttpStatus.OK).json(curriculums);
};

/**
 * Upload a CV document
 */
const uploadCV = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new InvalidInputException("Authentication required");
  }

  const userId = req.user.id;
  const { title } = req.body;

  if (!title || !title.trim()) {
    throw new InvalidInputException("Title is required");
  }

  if (!req.file) {
    throw new InvalidInputException("No CV file uploaded");
  }

  const curriculum = await curriculumService.uploadCV(userId, title, req.file);
  res.status(HttpStatus.CREATED).json(curriculum);
};

/**
 * Analyze a CV with AI
 */
const analyzeCV = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getCurriculumByIdSchema);

  // First get the curriculum to check ownership
  const existingCurriculum = await curriculumService.getById(id);
  if (!existingCurriculum) {
    throw new NotFoundException("Curriculum not found");
  }

  // Ensure user can only analyze their own curriculums
  if (existingCurriculum.userId !== req.user?.id) {
    throw new InsufficientPermissionsException("analyze this curriculum");
  }

  const analyzedCurriculum = await curriculumService.analyzeCV(id);
  res.status(HttpStatus.OK).json(analyzedCurriculum);
};

export default {
  getCurriculumById,
  updateCurriculum,
  getCurriculumsByUserId,
  getCurriculumsPaginated,
  uploadCV,
  analyzeCV,
};
