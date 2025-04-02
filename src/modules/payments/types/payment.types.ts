import { z } from 'zod'
import { payments, paymentStatusEnum } from '../entities/payment.entity'
import { createPaymentSchema, updatePaymentSchema } from '../zodSchemas/payment.schema'

export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
export type PaymentId = string

export type PaymentStatus = typeof paymentStatusEnum.enumValues[number]

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>
export type UpdatePaymentDto = z.infer<typeof updatePaymentSchema> 