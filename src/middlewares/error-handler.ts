import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { HttpException } from '../errors/http-exception'
import { HttpStatus } from '../enums/http-status-code'
import { ZodError } from 'zod'
import { AxiosError } from 'axios'

/**
 * Express middleware for handling errors and returning appropriate HTTP error responses.
 */
export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Handle HttpException (controlled errors)
  if (error instanceof HttpException) {
    console.error('Handled error:', error)
    res.status(error.code).json({
      message: error.message,
      code: error.code
    })
    return
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: 'Validation Error',
      code: HttpStatus.UNPROCESSABLE_ENTITY,
      issues: error.issues.map(issue => ({
        path: issue.path,
        message: issue.message,
      })),
    })
    return
  }

  // Handle Axios errors
  if (error instanceof AxiosError) {
    console.error('Axios error:', error.response?.data)
    res.status(error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.response?.data?.error || 'Internal Server Error',
      code: error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
    })
    return
  }

  // Handle uncontrolled errors
  console.error('Unhandled error:', error)
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
    code: HttpStatus.INTERNAL_SERVER_ERROR
  })
} 