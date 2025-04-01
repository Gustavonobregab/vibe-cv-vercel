import { db } from '../../../shared/database/config'
import { payments } from '../entities/payment.entity'
import { eq, desc, sql } from 'drizzle-orm'
import type { Payment, PaymentId, PaymentStatus } from '../types/payment.types'
import type { UserId } from '../../users/types/user.types'
import type { PaginationParams } from '../../../shared/types/common.types'

const create = async ({
  userId,
  amount,
  currency,
  paymentMethod,
  transactionId
}: {
  userId: UserId
  amount: number
  currency: string
  paymentMethod: string
  transactionId: string
}): Promise<Payment> => {
  const [payment] = await db.insert(payments).values({
    userId,
    amount: amount.toString(),
    currency,
    paymentMethod,
    transactionId,
    status: 'pending' as const
  }).returning()
  return payment
}

const getById = async (id: PaymentId): Promise<Payment | undefined> => {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id))

  return payment
}

const getByTransactionId = async (transactionId: string): Promise<Payment | undefined> => {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.transactionId, transactionId))

  return payment
}

const update = async (
  id: PaymentId,
  {
    status,
    statusReason
  }: {
    status: PaymentStatus
    statusReason?: string
  }
): Promise<Payment> => {
  const [payment] = await db
    .update(payments)
    .set({
      status: status as const,
      statusReason,
      updatedAt: new Date()
    })
    .where(eq(payments.id, id))
    .returning()

  return payment
}

const getByUserId = async (userId: UserId): Promise<Payment[]> => {
  return await db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt))
}

const getByStatus = async (status: PaymentStatus): Promise<Payment[]> => {
  return await db
    .select()
    .from(payments)
    .where(eq(payments.status, status as const))
    .orderBy(desc(payments.createdAt))
}

const getPaginated = async ({
  page = 1,
  limit = 10
}: {
  page?: number
  limit?: number
}): Promise<{
  items: Payment[]
  total: number
  page: number
  limit: number
  totalPages: number
}> => {
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
  getByTransactionId,
  update,
  getByUserId,
  getByStatus,
  getPaginated,
} 