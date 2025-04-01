import { db } from '../../../shared/database/config'
import { payments } from '../entities/payment.entity'
import { eq, desc, sql } from 'drizzle-orm'
import type { Payment, CreatePaymentDto, UpdatePaymentDto } from '../types/payment.types'
import type { PaginationParams } from '../../../shared/types/common.types'

const create = async (data: CreatePaymentDto): Promise<Payment> => {
  const [payment] = await db.insert(payments).values({
    ...data,
    amount: data.amount.toString()
  }).returning()
  return payment
}

const getById = async (id: string): Promise<Payment | undefined> => {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id))

  return payment
}

const update = async (id: string, data: UpdatePaymentDto): Promise<Payment> => {
  const [payment] = await db
    .update(payments)
    .set(data)
    .where(eq(payments.id, id))
    .returning()

  return payment
}

const getByCurriculumId = async (curriculumId: string): Promise<Payment[]> => {
  return await db
    .select()
    .from(payments)
    .where(eq(payments.curriculumId, curriculumId))
    .orderBy(desc(payments.createdAt))
}

const getPaginated = async ({ page = 1, limit = 10 }: PaginationParams): Promise<{
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
  update,
  getByCurriculumId,
  getPaginated,
} 