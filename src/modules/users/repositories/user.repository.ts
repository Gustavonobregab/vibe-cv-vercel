import { db } from '../../../shared/database'
import { users } from '../entities/user.entity'
import { eq, desc } from 'drizzle-orm'
import type { CreateGoogleUserDto, UpdateUserDto, UserId } from '../types/user.types'
import type { PaginationParams } from '../../../shared/types/common.types'

const create = async (data: CreateGoogleUserDto) => {
  return await db.insert(users).values(data).returning()
}

const getById = async (id: UserId) => {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id)
  })
}

const getByGoogleId = async (googleId: string) => {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.googleId, googleId)
  })
}

const getByEmail = async (email: string) => {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email)
  })
}

const update = async (id: UserId, data: UpdateUserDto) => {
  return await db.update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning()
}

const getPaginated = async ({ page, limit }: PaginationParams) => {
  const offset = (page - 1) * limit
  return await db.query.users.findMany({
    limit,
    offset,
    orderBy: (users, { desc }) => [desc(users.createdAt)]
  })
}

export default {
  create,
  getById,
  getByGoogleId,
  getByEmail,
  update,
  getPaginated
} 