import { db } from '../../../shared/database/config'
import { users } from '../entities/user.entity'
import { eq, desc } from 'drizzle-orm'
import type { CreateFromGoogleDto, UpdateUserDto, UpdateGoogleProfileDto, UserId } from '../types/user.types'
import type { PaginationParams } from '../../../shared/types/common.types'

const create = async ({
  googleId,
  email,
  name,
  picture,
  isActive
}: CreateFromGoogleDto) => {
  const [user] = await db.insert(users).values({
    googleId,
    email,
    name,
    picture,
    isActive
  }).returning()
  return user
}

const getById = async (id: UserId) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
  return user
}

const getByGoogleId = async (googleId: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.googleId, googleId))
  return user
}

const getByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
  return user
}

const update = async (id: UserId, updateData: UpdateUserDto | UpdateGoogleProfileDto) => {
  const [user] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id))
    .returning()
  return user
}

const getPaginated = async ({ page = 1, limit = 10 }: PaginationParams) => {
  const offset = (page - 1) * limit
  return await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset)
}

export default {
  create,
  getById,
  getByGoogleId,
  getByEmail,
  update,
  getPaginated
} 