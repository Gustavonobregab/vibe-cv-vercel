import { db } from '../../../shared/database/config'
import { curriculums } from '../entities/curriculum.entity'
import { eq, desc, sql } from 'drizzle-orm'

const createCurriculum = async (data: { title: string; content: string; rawContent: string; userId: string }) => {
  const [curriculum] = await db.insert(curriculums).values(data).returning()
  return curriculum
}

const getCurriculumById = async (id: string) => {
  const [curriculum] = await db
    .select()
    .from(curriculums)
    .where(eq(curriculums.id, id))

  return curriculum
}

const updateCurriculum = async (id: string, data: { title?: string; content?: string; rawContent?: string; status?: 'draft' | 'published' | 'archived' }) => {
  const [curriculum] = await db
    .update(curriculums)
    .set(data)
    .where(eq(curriculums.id, id))
    .returning()

  return curriculum
}

const getCurriculumsByStatus = async (status: 'draft' | 'published' | 'archived') => {
  return await db
    .select()
    .from(curriculums)
    .where(eq(curriculums.status, status))
    .orderBy(desc(curriculums.createdAt))
}

const getCurriculumsByUserId = async (userId: string) => {
  return await db
    .select()
    .from(curriculums)
    .where(eq(curriculums.userId, userId))
    .orderBy(desc(curriculums.createdAt))
}

const getCurriculumsPaginated = async (page: number = 1, limit: number = 10) => {
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
  createCurriculum,
  getCurriculumById,
  updateCurriculum,
  getCurriculumsByStatus,
  getCurriculumsByUserId,
  getCurriculumsPaginated,
} 