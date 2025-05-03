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
  uploadCVSchema,
} from "../zodSchemas/curriculum.schema";
import { paginationSchema } from "../../../shared/zodSchemas/common.schema";
import { HttpStatus } from "../../../shared/errors/http-status";

/**
 * Get a curriculum by ID
 */
const getCurriculumById = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getCurriculumByIdSchema);
  const curriculum = await curriculumService.getById(id, req.user!.id);

  res.status(HttpStatus.OK).json(curriculum);
};

/**
 * Update a curriculum
 */
const updateCurriculum = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getCurriculumByIdSchema);
  const validatedData = validateBody(req).with(updateCurriculumSchema);

  // First get the curriculum to check ownership
  await curriculumService.getById(id, req.user!.id);

  const curriculum = await curriculumService.update(id, validatedData);
  res.status(HttpStatus.OK).json(curriculum);
};

/**
 * Get curriculums by user ID
 */
const getCurriculumsByUserId = async (req: Request, res: Response) => {
  const curriculums = await curriculumService.getByUserId(req.user!.id);
  res.status(HttpStatus.OK).json(curriculums);
};

/**
 * Get paginated curriculums
 */
const getCurriculumsPaginated = async (req: Request, res: Response) => {
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
  const userId = req.user!.id;
  const validatedReq = validateBody(req).with(uploadCVSchema);

  const curriculum = await curriculumService.uploadCV(
    userId,
    validatedReq.title,
    validatedReq.file
  );
  res.status(HttpStatus.CREATED).json(curriculum);
};

/**
 * Analyze a CV with AI
 */
const analyzeCV = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getCurriculumByIdSchema);

  const analyzedCurriculum = await curriculumService.analyzeCV(
    id,
    req.user!.id
  );
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
