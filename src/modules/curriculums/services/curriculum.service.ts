import curriculumRepository from "../repositories/curriculum.repository";
import {
  NotFoundException,
  InvalidInputException,
  InsufficientPermissionsException,
} from "../../../shared/errors/http-exception";
import type {
  UpdateCurriculumDto,
  CurriculumId,
} from "../types/curriculum.types";
import type { UserId } from "../../users/types/user.types";
import type { PaginationParams } from "../../../shared/types/common.types";
import { put } from "@vercel/blob";
import { openaiService } from "../../ai";
import { httpUtils } from "../../../shared/http/http-client";
import { CVFile } from "@/shared/types/cvFile";

/**
 * Get a curriculum by ID
 * @param id The curriculum ID
 */
const getById = async (id: CurriculumId, userId: string) => {
  const curriculum = await curriculumRepository.getById(id);
  if (!curriculum) {
    throw new NotFoundException("Curriculum not found");
  }
  // Ensure user can only access their own curriculums
  if (curriculum.userId !== userId) {
    throw new InsufficientPermissionsException("access this curriculum");
  }
  return curriculum;
};

/**
 * Update a curriculum
 * @param id The curriculum ID to update
 * @param curriculum The curriculum data to update
 */
const update = async (id: CurriculumId, curriculum: UpdateCurriculumDto) => {
  const updatedCurriculum = await curriculumRepository.update(id, curriculum);
  if (!updatedCurriculum) {
    throw new NotFoundException("Curriculum not found");
  }
  return updatedCurriculum;
};

/**
 * Get curriculums by user ID
 * @param userId The user ID
 */
const getByUserId = async (userId: UserId) => {
  const curriculums = await curriculumRepository.getByUserId(userId);
  if (!curriculums.length) {
    throw new NotFoundException("No curriculums found for user");
  }
  return curriculums;
};

/**
 * Get paginated curriculums
 * @param params Pagination parameters
 */
const getPaginated = async ({ limit, page }: PaginationParams) => {
  const paginatedCurriculums = await curriculumRepository.getPaginated({
    page,
    limit,
  });
  if (!paginatedCurriculums.items.length) {
    throw new NotFoundException("No curriculums found");
  }

  return paginatedCurriculums;
};

/**
 * Upload a CV file
 * @param userId The user ID
 * @param title The curriculum title
 * @param file The uploaded file
 */
const uploadCV = async (userId: UserId, title: string, file: CVFile) => {
  // Upload CV to Vercel Blob
  const { url } = await put(
    `curriculums/${userId}/${Date.now()}-${file.originalname}`,
    file.buffer,
    {
      access: "public",
      contentType: file.mimetype,
    }
  );

  // Save curriculum with CV URL
  const curriculum = await curriculumRepository.create({
    userId,
    title,
    cvUrl: url,
  });

  if (!curriculum) {
    throw new InvalidInputException("Failed to upload CV");
  }

  return curriculum;
};

/**
 * Analyzes a CV using the AI module and saves the analysis results
 * @param id The curriculum ID to analyze
 * @returns Updated curriculum with analysis results
 */
const analyzeCV = async (id: CurriculumId, userId: string) => {
  // Get the curriculum from the database
  const curriculum = await getById(id, userId);

  if (!curriculum.cvUrl) {
    throw new InvalidInputException("Curriculum does not have a CV file");
  }

  // Download the CV file using our HTTP client
  const cvBuffer = await httpUtils.downloadFile(curriculum.cvUrl);

  // Analyze the CV using the AI module
  const analysisResult = await openaiService.analyzePdfCv(
    cvBuffer,
    `${curriculum.title}.pdf`
  );

  // Update the curriculum with the analysis results
  const updatedCurriculum = await curriculumRepository.update(id, {
    aiAnalysis: analysisResult,
  });

  if (!updatedCurriculum) {
    throw new InvalidInputException(
      "Failed to update curriculum with analysis results"
    );
  }

  return updatedCurriculum;
};

export default {
  getById,
  update,
  getByUserId,
  getPaginated,
  uploadCV,
  analyzeCV,
};
