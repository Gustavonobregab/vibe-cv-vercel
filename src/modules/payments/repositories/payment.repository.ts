import { db } from '../../../shared/database/config'
import { payments } from '../entities/payment.entity'
import { eq, desc, sql } from 'drizzle-orm'
import type { Payment, PaymentModel, CreatePaymentDto, UpdatePaymentDto } from '../types/payment.types'
import type { PaginationParams } from '../../../shared/types/common.types'

/**
 * Converts database model payment to API payment
 * @param payment Database payment model
 * @returns API payment with amount as number
 */
const convertToApiPayment = (payment: PaymentModel): Payment => ({
  ...payment,
  amount: parseFloat(payment.amount.toString())
})

/**
 * Create a new payment record in the database
 * @param payment Payment data to create
 * @returns The created payment
 */
const create = async (payment: CreatePaymentDto): Promise<Payment> => {
  // Handle amount as a string for PostgreSQL decimal type
  const [newPayment] = await db.insert(payments).values({
    ...payment,
    amount: payment.amount.toString()
  }).returning()

  // Convert amount back to number for consistent API response
  return convertToApiPayment(newPayment)
}

/**
 * Get a payment by ID
 * @param id Payment ID
 * @returns The payment or undefined if not found
 */
const getById = async (id: string): Promise<Payment | undefined> => {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id))

  if (payment) {
    // Convert amount to number for consistent API response
    return convertToApiPayment(payment)
  }

  return undefined
}

/**
 * Update a payment record
 * @param id Payment ID
 * @param payment Payment data to update
 * @returns The updated payment
 */
const update = async (id: string, payment: UpdatePaymentDto): Promise<Payment> => {
  const [updatedPayment] = await db
    .update(payments)
    .set(payment)
    .where(eq(payments.id, id))
    .returning()

  // Convert amount to number for consistent API response
  return convertToApiPayment(updatedPayment)
}

/**
 * Get payments by curriculum ID
 * @param curriculumId Curriculum ID
 * @returns List of payments for the curriculum
 */
const getByCurriculumId = async (curriculumId: string): Promise<Payment[]> => {
  const results = await db
    .select()
    .from(payments)
    .where(eq(payments.curriculumId, curriculumId))
    .orderBy(desc(payments.createdAt))

  // Convert amount to number for each payment
  return results.map(convertToApiPayment)
}

/**
 * Get paginated payments
 * @param params Pagination parameters
 * @returns Paginated list of payments
 */
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

  // Convert amount to number for each payment
  const mappedItems = items.map(convertToApiPayment)

  return {
    items: mappedItems,
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