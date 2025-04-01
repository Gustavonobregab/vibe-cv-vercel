import paymentRepository from '../repositories/payment.repository'
import { NotFoundException, InvalidInputException, DuplicateResourceException } from '../../../shared/errors/http-exception'
import type { CreatePaymentDto, UpdatePaymentDto, PaymentId, PaymentStatus } from '../types/payment.types'
import type { UserId } from '../../users/types/user.types'
import type { PaginationParams } from '../../../shared/types/common.types'
import { createPaymentSchema, updatePaymentSchema, paymentStatusEnum } from '../zodSchemas/payment.schema'

const create = async ({ userId, amount, currency, paymentMethod, transactionId }: CreatePaymentDto) => {
  const existingPayment = await paymentRepository.getByTransactionId(transactionId)
  if (existingPayment) {
    throw new DuplicateResourceException('payment transaction')
  }

  const payment = await paymentRepository.create({ userId, amount, currency, paymentMethod, transactionId })
  if (!payment) {
    throw new InvalidInputException('Failed to create payment')
  }

  await handlePaymentStatus(payment)
  return payment
}

const getById = async (id: PaymentId) => {
  const payment = await paymentRepository.getById(id)
  if (!payment) {
    throw new NotFoundException('Payment not found')
  }
  return payment
}

const update = async (id: PaymentId, { status, statusReason }: UpdatePaymentDto) => {
  const payment = await paymentRepository.update(id, { status, statusReason })
  if (!payment) {
    throw new NotFoundException('Payment not found')
  }

  await handlePaymentStatus(payment)
  return payment
}

const getByUserId = async (userId: UserId) => {
  const payments = await paymentRepository.getByUserId(userId)
  if (!payments.length) {
    throw new NotFoundException('No payments found for user')
  }
  return payments
}

const getByStatus = async (status: PaymentStatus) => {
  const payments = await paymentRepository.getByStatus(status)
  if (!payments.length) {
    throw new NotFoundException('No payments found with this status')
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

// Helper function to handle payment status updates
const handlePaymentStatus = async (payment: any) => {
  // Here you would implement payment status handling logic
  // For example, sending notifications, updating related records, etc.
  // This is just a placeholder for demonstration
  console.log(`Handling payment status update for payment ${payment.id}: ${payment.status}`)
}

export default {
  create,
  getById,
  update,
  getByUserId,
  getByStatus,
  getPaginated,
} 