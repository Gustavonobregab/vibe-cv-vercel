import { z } from "zod";
import {
  idSchema,
  dateFieldsSchema,
  paginatedResponseSchema,
} from "../../../shared/zodSchemas/common.schema";

// Curriculum status enum
export const curriculumStatusEnum = z.enum([
  "to_review",
  "reviewing",
  "reviewed",
]);

// Create curriculum request schema
export const createCurriculumSchema = z.object({
  title: z.string().min(1).max(255),
  cvUrl: z.string().url(),
  userId: idSchema,
});

// Update curriculum request schema
export const updateCurriculumSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  cvUrl: z.string().url().optional(),
  status: curriculumStatusEnum.optional(),
  aiAnalysis: z.any().optional(), // Using z.any() for flexibility with the complex AI response structure
});

// Upload CV request schema
export const uploadCVSchema = z.object({
  title: z.string().min(1, "Title is required"),
  file: z.object({
    fieldname: z.string(),
    originalname: z.string(),
    mimetype: z.string(),
    size: z.number().positive("File cannot be empty"),
    path: z.string(),
    filename: z.string(),
    buffer: z.instanceof(Buffer),
  }),
});

// Get curriculum by ID request schema
export const getCurriculumByIdSchema = z.object({
  id: idSchema,
});

// Get curriculums by user ID request schema
export const getCurriculumsByUserIdSchema = z.object({
  userId: idSchema,
});

// Get curriculums by status request schema
export const getCurriculumsByStatusSchema = z.object({
  status: curriculumStatusEnum,
});

// Response schemas
export const curriculumResponseSchema = z
  .object({
    id: idSchema,
    userId: idSchema,
    title: z.string(),
    cvUrl: z.string().url(),
    aiAnalysis: z.any().nullable(),
    status: curriculumStatusEnum,
  })
  .merge(dateFieldsSchema);

export const curriculumListResponseSchema = z.array(curriculumResponseSchema);

export const paginatedCurriculumResponseSchema = paginatedResponseSchema(
  curriculumResponseSchema
);
