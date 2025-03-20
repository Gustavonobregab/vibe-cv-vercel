import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../errors/http-exception'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Handled error:', error)

  if (error instanceof HttpException) {
    return res.status(error.code).json({
      status: 'error',
      message: error.message,
      details: error.details
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
} 