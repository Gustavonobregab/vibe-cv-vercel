import { Request, Response, NextFunction } from 'express'
import { NotFoundException } from '../errors/http-exception'

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new NotFoundException(`Route ${req.method} ${req.path} not found`))
} 