import { db } from '../../../shared/database/config'
import { payments } from '../entities/payment.entity'
import { eq, desc, sql } from 'drizzle-orm'
import type { Payment, CreatePaymentDto, UpdatePaymentDto } from '../types/payment.types'
import type { PaginationParams } from '../../../shared/types/common.types'

const create = async (payment: CreatePaymentDto): Promise<Payment> => {
  const [newPayment] = await db.insert(payments).values({
    ...payment,
    amount: payment.amount.toString()
  }).returning()
  return newPayment
}

const getById = async (id: string): Promise<Payment | undefined> => {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id))

  return payment
}

const update = async (id: string, payment: UpdatePaymentDto): Promise<Payment> => {
  const [updatedPayment] = await db
    .update(payments)
    .set(payment)
    .where(eq(payments.id, id))
    .returning()

  return updatedPayment
}

const getByCurriculumId = async (curriculumId: string): Promise<Payment[]> => {
  return await db
    .select()
    .from(payments)
    .where(eq(payments.curriculumId, curriculumId))
    .orderBy(desc(payments.createdAt))
}

const getPaginated = async (params: PaginationParams): Promise<{
  items: Payment[]
  total: number
  page: number
  limit: number
  totalPages: number
}> => {
  const page = params.page ?? 1
  const limit = params.limit ?? 10
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