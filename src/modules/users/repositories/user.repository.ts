import { db } from '../../../shared/database/config'
import { users } from '../entities/user.entity'
import { eq } from 'drizzle-orm'
import type { User } from '../types/user.types'

const createUser = async ({
  googleId,
  email,
  name,
  picture
}: {
  googleId: string
  email: string
  name: string
  picture?: string
}): Promise<User> => {
  const [user] = await db.insert(users).values({
    googleId,
    email,
    name,
    picture,
    isActive: true
  }).returning()
  return user
}

const getUserById = async (id: string): Promise<User | undefined> => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))

  return user
}

const getUserByGoogleId = async (googleId: string): Promise<User | undefined> => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.googleId, googleId))

  return user
}

const getUserByEmail = async (email: string): Promise<User | undefined> => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))

  return user
}

const updateUser = async (
  id: string,
  {
    name,
    picture,
    isActive
  }: {
    name?: string
    picture?: string
    isActive?: boolean
  }
): Promise<User> => {
  const [user] = await db
    .update(users)
    .set({
      name,
      picture,
      isActive,
      updatedAt: new Date()
    })
    .where(eq(users.id, id))
    .returning()

  return user
}

export default {
  createUser,
  getUserById,
  getUserByGoogleId,
  getUserByEmail,
  updateUser,
} 