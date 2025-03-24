import { z } from 'zod'

// Common ID schema (UUID)
export const idSchema = z.string().uuid()

// Common pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

// Common response schema for pagination
export const paginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  })

// Common date fields schema
export const dateFieldsSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Common error response schema
export const errorResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
})

// Common currency schema (ISO 4217)
const ISO_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'NZD', 'SGD', 'ZAR']
export const currencySchema = z.string().length(3).toUpperCase().refine((val) => ISO_CURRENCIES.includes(val), {
  message: 'Invalid currency code. Must be a valid ISO 4217 currency code.',
})

// Common money schema
export const moneySchema = z.object({
  amount: z.number().positive().multipleOf(0.01),
  currency: currencySchema,
}) 