import { db } from '../../../shared/database/config'
import { curriculums, curriculumStatusEnum } from '../entities/curriculum.entity'
import { eq, desc, sql } from 'drizzle-orm'
import type { Curriculum, CreateCurriculumDto, UpdateCurriculumDto } from '../types/curriculum.types'
import type { PaginationParams } from '../../../shared/types/common.types'

const create = async (curriculum: CreateCurriculumDto): Promise<Curriculum> => {
  const [newCurriculum] = await db.insert(curriculums).values(curriculum).returning()
  return newCurriculum
}

const getById = async (id: string): Promise<Curriculum | undefined> => {
  const [curriculum] = await db
    .select()
    .from(curriculums)
    .where(eq(curriculums.id, id))

  return curriculum
}

const update = async (id: string, curriculum: UpdateCurriculumDto): Promise<Curriculum> => {
  const [updatedCurriculum] = await db
    .update(curriculums)
    .set(curriculum)
    .where(eq(curriculums.id, id))
    .returning()

  return updatedCurriculum
}

const getByStatus = async (status: typeof curriculumStatusEnum.enumValues[number]): Promise<Curriculum[]> => {
  return await db
    .select()
    .from(curriculums)
    .where(eq(curriculums.status, status))
    .orderBy(desc(curriculums.createdAt))
}

const getByUserId = async (userId: string): Promise<Curriculum[]> => {
  return await db
    .select()
    .from(curriculums)
    .where(eq(curriculums.userId, userId))
    .orderBy(desc(curriculums.createdAt))
}

const getPaginated = async (params: PaginationParams): Promise<{
  items: Curriculum[]
  total: number
  page: number
  limit: number
  totalPages: number
}> => {
  const page = params.page ?? 1
  const limit = params.limit ?? 10
  const offset = (page - 1) * limit

  const [total, items] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(curriculums),
    db
      .select()
      .from(curriculums)
      .orderBy(desc(curriculums.createdAt))
      .limit(limit)
      .offset(offset),
  ])

  return {
    items,
    total: Number(total[0].count),
    page,
    limit,
    totalPages: Math.ceil(Number(total[0].count) / limit),
  }
}

export default {
  create,
  getById,
  update,
  getByStatus,
  getByUserId,
  getPaginated,
} 