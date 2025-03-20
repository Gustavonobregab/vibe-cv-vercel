import { db } from '../../../shared/database/config'
import { payments } from '../entities/payment.entity'
import { eq, desc, sql } from 'drizzle-orm'

const create = async (data: { userId: number; amount: number; currency: string; paymentMethod: string; transactionId: string }) => {
  const [payment] = await db.insert(payments).values(data).returning()
  return payment
}

const getById = async (id: number) => {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id))

  return payment
}

const update = async (id: number, data: { status: string; statusReason?: string }) => {
  const [payment] = await db
    .update(payments)
    .set(data)
    .where(eq(payments.id, id))
    .returning()

  return payment
}

const getByUserId = async (userId: number) => {
  return await db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt))
}

const getByStatus = async (status: string) => {
  return await db
    .select()
    .from(payments)
    .where(eq(payments.status, status))
    .orderBy(desc(payments.createdAt))
}

const getPaginated = async (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit

  const [total, items] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(payments),
    db
      .select()
      .from(payments)
      .orderBy(desc(payments.createdAt))
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
  getByUserId,
  getByStatus,
  getPaginated,
} 