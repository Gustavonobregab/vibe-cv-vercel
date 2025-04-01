import paymentRepository from '../repositories/payment.repository'
import { NotFoundException, InvalidInputException } from '../../../shared/errors/http-exception'
import type { CreatePaymentDto, UpdatePaymentDto, PaymentId } from '../types/payment.types'
import type { PaginationParams } from '../../../shared/types/common.types'

const create = async (data: CreatePaymentDto) => {
  const payment = await paymentRepository.create(data)
  if (!payment) {
    throw new InvalidInputException('Failed to create payment')
  }
  return payment
}

const getById = async (id: PaymentId) => {
  const payment = await paymentRepository.getById(id)
  if (!payment) {
    throw new NotFoundException('Payment not found')
  }
  return payment
}

const update = async (id: PaymentId, data: UpdatePaymentDto) => {
  const payment = await paymentRepository.update(id, data)
  if (!payment) {
    throw new NotFoundException('Payment not found')
  }
  return payment
}

const getByCurriculumId = async (curriculumId: string) => {
  const payments = await paymentRepository.getByCurriculumId(curriculumId)
  if (!payments.length) {
    throw new NotFoundException('No payments found for curriculum')
  }
  return payments
}

const getPaginated = async ({ page, limit }: PaginationParams) => {
  const validatedPage = page ?? 1
  const validatedLimit = limit ?? 10

  if (validatedPage < 1 || validatedLimit < 1) {
    throw new InvalidInputException('Invalid pagination parameters')
  }

  const paginatedPayments = await paymentRepository.getPaginated({ page: validatedPage, limit: validatedLimit })
  if (!paginatedPayments.items.length) {
    throw new NotFoundException('No payments found')
  }

  return paginatedPayments
}

export default {
  create,
  getById,
  update,
  getByCurriculumId,
  getPaginated,
} 