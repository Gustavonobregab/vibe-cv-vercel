import { db } from '../../../shared/database/config'
import { users } from '../entities/user.entity'
import { eq } from 'drizzle-orm'

const createUser = async (data: { googleId: string; email: string; name: string; picture?: string }) => {
  const [user] = await db.insert(users).values(data).returning()
  return user
}

const getUserById = async (id: number) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))

  return user
}

const getUserByGoogleId = async (googleId: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.googleId, googleId))

  return user
}

const getUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))

  return user
}

const updateUser = async (id: number, data: { name?: string; picture?: string; isActive?: boolean }) => {
  const [user] = await db
    .update(users)
    .set(data)
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