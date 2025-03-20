import { db } from '../../../shared/database/config'
import { ownerships } from '../entities/ownership.entity'
import { curriculums } from '../../curriculums/entities/curriculum.entity'
import { eq, and, desc, sql } from 'drizzle-orm'

const create = async (data: { userId: number; curriculumId: number }) => {
  const [ownership] = await db.insert(ownerships).values(data).returning()
  return ownership
}

const getByCurriculumId = async (curriculumId: number) => {
  const [ownership] = await db
    .select()
    .from(ownerships)
    .where(eq(ownerships.curriculumId, curriculumId))

  return ownership
}

const getByUserId = async (userId: number) => {
  return await db
    .select()
    .from(ownerships)
    .where(eq(ownerships.userId, userId))
}

const getByUserAndCurriculum = async (userId: number, curriculumId: number) => {
  const [ownership] = await db
    .select()
    .from(ownerships)
    .where(
      and(
        eq(ownerships.userId, userId),
        eq(ownerships.curriculumId, curriculumId)
      )
    )

  return ownership
}

const getCurriculumsByUser = async (userId: number) => {
  return await db
    .select({
      curriculum: curriculums,
    })
    .from(ownerships)
    .innerJoin(curriculums, eq(ownerships.curriculumId, curriculums.id))
    .where(eq(ownerships.userId, userId))
    .orderBy(desc(ownerships.createdAt))
}

const getAllCurriculumsPaginated = async (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit

  const [total, items] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(ownerships),
    db
      .select({
        curriculum: curriculums,
        ownership: ownerships,
      })
      .from(ownerships)
      .innerJoin(curriculums, eq(ownerships.curriculumId, curriculums.id))
      .orderBy(desc(ownerships.createdAt))
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

const getOwnershipById = async (id: number) => {
  const [ownership] = await db
    .select({
      ownership: ownerships,
      curriculum: curriculums,
    })
    .from(ownerships)
    .innerJoin(curriculums, eq(ownerships.curriculumId, curriculums.id))
    .where(eq(ownerships.id, id))

  return ownership
}

const checkUserOwnsCurriculum = async (userId: number, curriculumId: number) => {
  const [ownership] = await db
    .select()
    .from(ownerships)
    .where(
      and(
        eq(ownerships.userId, userId),
        eq(ownerships.curriculumId, curriculumId)
      )
    )
    .limit(1)

  return !!ownership
}

export default {
  create,
  getByCurriculumId,
  getByUserId,
  getByUserAndCurriculum,
  getCurriculumsByUser,
  getAllCurriculumsPaginated,
  getOwnershipById,
  checkUserOwnsCurriculum,
} 