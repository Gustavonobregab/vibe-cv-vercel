import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { HttpException } from '../errors/http-exception'

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof HttpException) {
    res.status(error.code).json({
      status: 'error',
      message: error.message,
      details: error.details
    })
    return
  }

  // Log unexpected errors
  console.error('Unexpected error:', error)

  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
} 