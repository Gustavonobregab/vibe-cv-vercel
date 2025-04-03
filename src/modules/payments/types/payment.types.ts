import { z } from 'zod'
import { payments, paymentStatusEnum } from '../entities/payment.entity'
import { createPaymentSchema, updatePaymentSchema } from '../zodSchemas/payment.schema'

// Database model types
export type PaymentModel = typeof payments.$inferSelect
export type NewPaymentModel = typeof payments.$inferInsert

// API facing types (with amount as number)
export type Payment = Omit<PaymentModel, 'amount'> & { amount: number }
export type PaymentId = string

export type PaymentStatus = typeof paymentStatusEnum.enumValues[number]

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>
export type UpdatePaymentDto = z.infer<typeof updatePaymentSchema> 