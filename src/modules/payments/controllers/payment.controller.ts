import { Request, Response } from 'express'
import paymentService from '../services/payment.service'
import { validateBody, validateParams, validateQuery } from '../../../shared/validators/validate-schema'
import {
  createPaymentSchema,
  updatePaymentSchema,
  getPaymentByIdSchema,
  getPaymentsByCurriculumIdSchema,
} from '../zodSchemas/payment.schema'
import { paginationSchema } from '../../../shared/zodSchemas/common.schema'
import { NotFoundException } from '../../../shared/errors/http-exception'

const createPayment = async (req: Request, res: Response) => {
  const validatedData = validateBody(req).with(createPaymentSchema)
  const payment = await paymentService.create(validatedData)
  res.status(201).json(payment)
}

const getPaymentById = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getPaymentByIdSchema)
  const payment = await paymentService.getById(id)
  res.json(payment)
}

const getPaymentByTransactionId = async (req: Request, res: Response) => {
  const { id: transactionId } = validateParams(req).with(getPaymentByIdSchema)
  const payment = await paymentService.getById(transactionId)
  res.json(payment)
}

const updatePayment = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getPaymentByIdSchema)
  const validatedData = validateBody(req).with(updatePaymentSchema)
  const payment = await paymentService.update(id, validatedData)
  res.json(payment)
}

const getPaymentsByCurriculumId = async (req: Request, res: Response) => {
  const { curriculumId } = validateParams(req).with(getPaymentsByCurriculumIdSchema)
  const payments = await paymentService.getByCurriculumId(curriculumId)
  res.json(payments)
}

const getPaymentsPaginated = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = validateQuery(req).with(paginationSchema)
  const payments = await paymentService.getPaginated({
    page: Number(page),
    limit: Number(limit)
  })
  res.json(payments)
}

export default {
  createPayment,
  getPaymentById,
  getPaymentByTransactionId,
  updatePayment,
  getPaymentsByCurriculumId,
  getPaymentsPaginated
} 