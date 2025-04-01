import { z } from 'zod'
import { payments, paymentStatusEnum } from '../entities/payment.entity'
import type { InferModel } from 'drizzle-orm'
import { createPaymentSchema, updatePaymentSchema } from '../zodSchemas/payment.schema'

export type Payment = InferModel<typeof payments>
export type NewPayment = InferModel<typeof payments, 'insert'>
export type PaymentId = string

export type PaymentStatus = typeof paymentStatusEnum.enumValues[number]

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>
export type UpdatePaymentDto = z.infer<typeof updatePaymentSchema> 