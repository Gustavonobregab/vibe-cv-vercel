import { db } from '../../../shared/database/config'
import { users } from '../entities/user.entity'
import { eq, desc, sql } from 'drizzle-orm'
import type { CreateFromGoogleDto, UpdateUserDto, UpdateGoogleProfileDto, UserId } from '../types/user.types'
import type { PaginationParams } from '../../../shared/types/common.types'

/**
 * Create a new user in the database
 * @param data User data to create
 * @returns The created user
 */
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

/**
 * Get a user by ID
 * @param id User ID
 * @returns The user or undefined if not found
 */
const getById = async (id: UserId) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
  return user
}

/**
 * Get a user by Google ID
 * @param googleId Google ID
 * @returns The user or undefined if not found
 */
const getByGoogleId = async (googleId: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.googleId, googleId))
  return user
}

/**
 * Get a user by email
 * @param email Email address
 * @returns The user or undefined if not found
 */
const getByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
  return user
}

/**
 * Update a user
 * @param id User ID
 * @param updateData Data to update
 * @returns The updated user
 */
const update = async (id: UserId, updateData: UpdateUserDto | UpdateGoogleProfileDto) => {
  const [user] = await db
    .update(users)
    .set({
      ...updateData,
      updatedAt: new Date()
    })
    .where(eq(users.id, id))
    .returning()
  return user
}

/**
 * Get a paginated list of users
 * @param params Pagination parameters
 * @returns List of users
 */
const getPaginated = async ({ page = 1, limit = 10 }: PaginationParams) => {
  const offset = (page - 1) * limit

  // Get users with pagination
  const results = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset)

  // Get total count for pagination
  const [count] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)

  return {
    items: results,
    total: Number(count.count),
    page,
    limit,
    totalPages: Math.ceil(Number(count.count) / limit)
  }
}

export default {
  create,
  getById,
  getByGoogleId,
  getByEmail,
  update,
  getPaginated
} 