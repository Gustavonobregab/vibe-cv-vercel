import { db } from '../../../shared/database/config'
import { payables } from '../entities/payable.entity'
import { curriculums } from '../../curriculums/entities/curriculum.entity'
import { eq, desc, sql } from 'drizzle-orm'

const create = async (data: {
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: 'pix' | 'credit';
  transactionId: string;
  curriculumId: string;
}) => {
  // Convert the numeric amount to a string for the decimal column
  const payableData = {
    curriculumId: data.curriculumId,
    amount: data.amount.toString(),
    currency: data.currency,
    paymentMethod: data.paymentMethod,
    transactionId: data.transactionId,
    status: 'pending' as const,
  };

  const [payment] = await db.insert(payables).values(payableData).returning()
  return payment
}

const getById = async (id: string) => {
  const [payment] = await db
    .select()
    .from(payables)
    .where(eq(payables.id, id))

  return payment
}

const update = async (id: string, data: {
  status: 'pending' | 'paid' | 'cancelled' | 'failed';
  statusReason?: string
}) => {
  const [payment] = await db
    .update(payables)
    .set(data)
    .where(eq(payables.id, id))
    .returning()

  return payment
}

const getByUserId = async (userId: string) => {
  // Join with curriculums to get the userId
  return await db
    .select()
    .from(payables)
    .innerJoin(curriculums, eq(payables.curriculumId, curriculums.id))
    .where(eq(curriculums.userId, userId))
    .orderBy(desc(payables.createdAt))
}

const getByStatus = async (status: 'pending' | 'paid' | 'cancelled' | 'failed') => {
  return await db
    .select()
    .from(payables)
    .where(eq(payables.status, status))
    .orderBy(desc(payables.createdAt))
}

const getByTransactionId = async (transactionId: string) => {
  const [payment] = await db
    .select()
    .from(payables)
    .where(eq(payables.transactionId, transactionId))

  return payment
}

const getPaginated = async (params: { page: number; limit: number }) => {
  const { page = 1, limit = 10 } = params
  const offset = (page - 1) * limit

  const [total, items] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(payables),
    db
      .select()
      .from(payables)
      .orderBy(desc(payables.createdAt))
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
  getByTransactionId,
  getPaginated,
} 