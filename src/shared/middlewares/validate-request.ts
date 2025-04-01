import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { InvalidInputException } from '../errors/http-exception'

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })

      // Replace request data with validated data
      req.body = validatedData.body
      req.query = validatedData.query
      req.params = validatedData.params

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        next(new InvalidInputException(`Validation failed: ${JSON.stringify(errors)}`))
      } else {
        next(error)
      }
    }
  }
} 