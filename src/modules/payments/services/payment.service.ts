import paymentRepository from '../repositories/payment.repository'
import { NotFoundException, InvalidInputException } from '../../../shared/errors/http-exception'
import type { CreatePaymentDto, UpdatePaymentDto, PaymentId } from '../types/payment.types'
import type { PaginationParams } from '../../../shared/types/common.types'
import AbacatePay from 'abacatepay-nodejs-sdk'
import { config } from '../../../shared/config'
import { PaymentStrategyFactory } from '@/modules/payment-providers/services/payment-strategy'

const abacate = AbacatePay(config.abacatePay.key || '');

/**
 * Create a new payment
 * @param payment The payment data to create
 * @returns The created payment
 */
const create = async (payment: CreatePaymentDto) => {
  // Validate payment amount
  if (payment.amount <= 0) {
    throw new InvalidInputException('Payment amount must be greater than zero')
  }

  // Validate payment method
  if (!payment.paymentMethod || payment.paymentMethod.trim() === '') {
    throw new InvalidInputException('Payment method is required')
  }

  //Use strategy to process with the right provider (before saving)
   const strategy = PaymentStrategyFactory.getStrategy(payment)
   
  //Calling the strategy to create the payment
   await strategy.createPayment(payment)

  //Save the payment in the database
  const newPayment = await paymentRepository.create(payment)
  if (!newPayment) {
    throw new InvalidInputException('Failed to create payment')
  }
  return newPayment
}

/**
 * Get a payment by ID
 * @param id The payment ID
 * @returns The payment
 */
const getById = async (id: PaymentId) => {
  if (!id) {
    throw new InvalidInputException('Payment ID is required')
  }

  const payment = await paymentRepository.getById(id)
  if (!payment) {
    throw new NotFoundException('Payment not found')
  }
  return payment
}

/**
 * Update a payment
 * @param id The payment ID
 * @param payment The payment data to update
 * @returns The updated payment
 */
const update = async (id: PaymentId, payment: UpdatePaymentDto) => {
  if (!id) {
    throw new InvalidInputException('Payment ID is required')
  }

  // Check if payment exists
  await getById(id)

  const updatedPayment = await paymentRepository.update(id, payment)
  if (!updatedPayment) {
    throw new NotFoundException('Payment not found')
  }
  return updatedPayment
}

/**
 * Get payments by curriculum ID
 * @param curriculumId The curriculum ID
 * @returns List of payments for the curriculum
 */
const getByCurriculumId = async (curriculumId: string) => {
  if (!curriculumId) {
    throw new InvalidInputException('Curriculum ID is required')
  }

  const payments = await paymentRepository.getByCurriculumId(curriculumId)
  if (!payments.length) {
    throw new NotFoundException('No payments found for curriculum')
  }
  return payments
}

/**
 * Get paginated payments
 * @param params Pagination parameters
 * @returns Paginated list of payments
 */
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