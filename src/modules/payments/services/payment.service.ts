import paymentRepository from '../repositories/payment.repository'
import { NotFoundException, InvalidInputException } from '../../../shared/errors/http-exception'
import type { CreatePaymentDto, UpdatePaymentDto, PaymentId } from '../types/payment.types'
import type { PaginationParams } from '../../../shared/types/common.types'

const create = async (payment: CreatePaymentDto) => {
  const newPayment = await paymentRepository.create(payment)
  if (!newPayment) {
    throw new InvalidInputException('Failed to create payment')
  }
  return newPayment
}

const getById = async (id: PaymentId) => {
  const payment = await paymentRepository.getById(id)
  if (!payment) {
    throw new NotFoundException('Payment not found')
  }
  return payment
}

const update = async (id: PaymentId, payment: UpdatePaymentDto) => {
  const updatedPayment = await paymentRepository.update(id, payment)
  if (!updatedPayment) {
    throw new NotFoundException('Payment not found')
  }
  return updatedPayment
}

const getByCurriculumId = async (curriculumId: string) => {
  const payments = await paymentRepository.getByCurriculumId(curriculumId)
  if (!payments.length) {
    throw new NotFoundException('No payments found for curriculum')
  }
  return payments
}

const getPaginated = async (params: PaginationParams) => {
  const validatedPage = params.page ?? 1
  const validatedLimit = params.limit ?? 10

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