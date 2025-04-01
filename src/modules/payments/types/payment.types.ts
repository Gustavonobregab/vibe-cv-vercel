import { z } from 'zod'
import { payments, paymentStatusEnum, paymentMethodEnum } from '../entities/payment.entity'
import type { InferModel } from 'drizzle-orm'
import type { UserId } from '../../users/types/user.types'

export type Payment = InferModel<typeof payments>
export type NewPayment = InferModel<typeof payments, 'insert'>
export type PaymentId = string

export type PaymentStatus = typeof paymentStatusEnum._type
export type PaymentMethod = typeof paymentMethodEnum._type

export const createPaymentSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'bank_transfer', 'paypal']),
  transactionId: z.string().uuid(),
})

export const updatePaymentSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'refunded']),
  statusReason: z.string().optional(),
})

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>
export type UpdatePaymentDto = z.infer<typeof updatePaymentSchema> 