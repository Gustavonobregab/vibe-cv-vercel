import { Request } from 'express'
import { z, ZodSchema } from 'zod'

/**
 * Validates request body using a Zod schema and returns the validated data
 */
export const validateBody = <T>(req: Request) => ({
  with: <U extends ZodSchema<T>>(schema: U): z.infer<U> => schema.parse(req.body)
})

/**
 * Validates request query parameters using a Zod schema and returns the validated data
 */
export const validateQuery = <T>(req: Request) => ({
  with: <U extends ZodSchema<T>>(schema: U): z.infer<U> => schema.parse(req.query)
})

/**
 * Validates request parameters using a Zod schema and returns the validated data
 */
export const validateParams = <T>(req: Request) => ({
  with: <U extends ZodSchema<T>>(schema: U): z.infer<U> => schema.parse(req.params)
})

/**
 * Validates request headers using a Zod schema and returns the validated data
 */
export const validateHeaders = <T>(req: Request) => ({
  with: <U extends ZodSchema<T>>(schema: U): z.infer<U> => schema.parse(req.headers)
}) 