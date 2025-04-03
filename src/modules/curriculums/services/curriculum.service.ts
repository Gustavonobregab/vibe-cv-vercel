import curriculumRepository from '../repositories/curriculum.repository'
import { NotFoundException, InvalidInputException } from '../../../shared/errors/http-exception'
import type { UpdateCurriculumDto, CurriculumId } from '../types/curriculum.types'
import type { UserId } from '../../users/types/user.types'
import type { PaginationParams } from '../../../shared/types/common.types'
import { put } from '@vercel/blob'
import { openaiService } from '../../ai'
import type { CvAnalysisResponse } from '../../ai/types/ai.types'

const getById = async (id: CurriculumId) => {
  const curriculum = await curriculumRepository.getById(id)
  if (!curriculum) {
    throw new NotFoundException('Curriculum not found')
  }
  return curriculum
}

const update = async (id: CurriculumId, curriculum: UpdateCurriculumDto) => {
  const updatedCurriculum = await curriculumRepository.update(id, curriculum)
  if (!updatedCurriculum) {
    throw new NotFoundException('Curriculum not found')
  }
  return updatedCurriculum
}

const getByUserId = async (userId: UserId) => {
  const curriculums = await curriculumRepository.getByUserId(userId)
  if (!curriculums.length) {
    throw new NotFoundException('No curriculums found for user')
  }
  return curriculums
}

const getPaginated = async (params: PaginationParams) => {
  const validatedPage = params.page ?? 1
  const validatedLimit = params.limit ?? 10

  if (validatedPage < 1 || validatedLimit < 1) {
    throw new InvalidInputException('Invalid pagination parameters')
  }

  const paginatedCurriculums = await curriculumRepository.getPaginated({ page: validatedPage, limit: validatedLimit })
  if (!paginatedCurriculums.items.length) {
    throw new NotFoundException('No curriculums found')
  }

  return paginatedCurriculums
}

const uploadCV = async (userId: UserId, title: string, file: Express.Multer.File) => {
  // Upload CV to Vercel Blob
  const { url } = await put(`curriculums/${userId}/${Date.now()}-${file.originalname}`, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
  })

  // Save curriculum with CV URL
  const curriculum = await curriculumRepository.create({
    userId,
    title,
    cvUrl: url
  })

  if (!curriculum) {
    throw new InvalidInputException('Failed to upload CV')
  }

  return curriculum
}

/**
 * Analyzes a CV using the AI module and saves the analysis results
 * @param id The curriculum ID to analyze
 * @returns Updated curriculum with analysis results
 */
const analyzeCV = async (id: CurriculumId) => {
  // Get the curriculum from the database
  const curriculum = await getById(id)

  if (!curriculum.cvUrl) {
    throw new InvalidInputException('Curriculum does not have a CV file')
  }

  // Fetch the CV file from the URL
  const cvResponse = await fetch(curriculum.cvUrl)

  if (!cvResponse.ok) {
    throw new InvalidInputException('Failed to fetch CV file')
  }

  // Convert the response to a buffer
  const cvBuffer = Buffer.from(await cvResponse.arrayBuffer())

  // Analyze the CV using the AI module
  const analysisResult = await openaiService.analyzePdfCv(cvBuffer, `${curriculum.title}.pdf`)

  // Update the curriculum with the analysis results
  const updatedCurriculum = await curriculumRepository.update(id, {
    iaAnalysis: analysisResult
  })

  if (!updatedCurriculum) {
    throw new InvalidInputException('Failed to update curriculum with analysis results')
  }

  return updatedCurriculum
}

export default {
  getById,
  update,
  getByUserId,
  getPaginated,
  uploadCV,
  analyzeCV
} 