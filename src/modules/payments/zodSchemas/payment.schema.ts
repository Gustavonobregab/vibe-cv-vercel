import { z } from 'zod'
import { idSchema, dateFieldsSchema, paginatedResponseSchema } from '../../../shared/zodSchemas/common.schema'

// Payment status enum
export const paymentStatusEnum = z.enum(['pending', 'processing', 'paid', 'failed', 'refunded'])

// Create payment request schema
export const createPaymentSchema = z.object({
  curriculumId: idSchema,
  amount: z.number().positive(),
  paymentMethod: z.string().min(1),
  paymentDetails: z.string().optional(),
})

// Update payment request schema
export const updatePaymentSchema = z.object({
  status: paymentStatusEnum.optional(),
  paymentDetails: z.string().optional(),
})

// Get payment by ID request schema
export const getPaymentByIdSchema = z.object({
  id: idSchema,
})

// Get payments by curriculum ID request schema
export const getPaymentsByCurriculumIdSchema = z.object({
  curriculumId: idSchema,
})

// Response schemas
export const paymentResponseSchema = z.object({
  id: idSchema,
  curriculumId: idSchema,
  amount: z.number(),
  status: paymentStatusEnum,
  paymentMethod: z.string(),
  paymentDetails: z.string().nullable(),
}).merge(dateFieldsSchema)

export const paymentListResponseSchema = z.array(paymentResponseSchema)

export const paginatedPaymentResponseSchema = paginatedResponseSchema(paymentResponseSchema) 