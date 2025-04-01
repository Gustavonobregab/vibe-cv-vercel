import { z } from 'zod'
import { idSchema, dateFieldsSchema, paginatedResponseSchema, moneySchema } from '../../../shared/zodSchemas/common.schema'

// Payment status enum
export const paymentStatusEnum = z.enum(['pending', 'processing', 'completed', 'failed', 'refunded'])

// Payment method enum
export const paymentMethodEnum = z.enum(['credit_card', 'debit_card', 'bank_transfer', 'paypal'])

// Create payment request schema
export const createPaymentSchema = z.object({
  userId: idSchema,
  ...moneySchema.shape,
  paymentMethod: paymentMethodEnum,
  transactionId: z.string().uuid(),
})

// Update payment request schema
export const updatePaymentSchema = z.object({
  status: paymentStatusEnum,
  statusReason: z.string().optional(),
})

// Get payment by ID request schema
export const getPaymentByIdSchema = z.object({
  id: idSchema,
})

// Get payments by user request schema
export const getPaymentsByUserSchema = z.object({
  userId: idSchema,
})

// Get payments by status request schema
export const getPaymentsByStatusSchema = z.object({
  status: paymentStatusEnum,
})

// Response schemas
export const paymentResponseSchema = z.object({
  id: idSchema,
  ...moneySchema.shape,
  paymentMethod: paymentMethodEnum,
  transactionId: z.string(),
  status: paymentStatusEnum,
  statusReason: z.string().nullable(),
}).merge(dateFieldsSchema)

export const paymentListResponseSchema = z.array(paymentResponseSchema)

export const paginatedPaymentResponseSchema = paginatedResponseSchema(paymentResponseSchema) 