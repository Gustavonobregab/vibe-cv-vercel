import paymentRepository from '../repositories/payment.repository'
import { NotFoundException, InvalidInputException, DuplicateResourceException } from '../../../shared/errors/http-exception'
import { CreatePaymentDto, UpdatePaymentDto, PaginationParams } from '../../../shared/types/common.types'
import { createPaymentSchema, updatePaymentSchema, paymentStatusEnum } from '../zodSchemas/payment.schema'

type PaymentStatus = typeof paymentStatusEnum._type

const create = async (data: CreatePaymentDto) => {
  // Validate input data
  const validatedData = createPaymentSchema.parse(data)

  // Check for duplicate transaction
  const existingPayment = await paymentRepository.getByTransactionId(validatedData.transactionId)
  if (existingPayment) {
    throw new DuplicateResourceException('payment transaction')
  }

  // Create payment
  const payment = await paymentRepository.create(validatedData)
  if (!payment) {
    throw new InvalidInputException('Failed to create payment')
  }

  // Handle payment status updates
  await handlePaymentStatus(payment)

  return payment
}

const getById = async (id: string) => {
  const payment = await paymentRepository.getById(id)
  if (!payment) {
    throw new NotFoundException('Payment not found')
  }

  return payment
}

const update = async (id: string, { status, statusReason }: UpdatePaymentDto) => {
  // Validate input data
  const validatedData = updatePaymentSchema.parse({ status, statusReason })

  // Update payment
  const payment = await paymentRepository.update(id, validatedData)
  if (!payment) {
    throw new NotFoundException('Payment not found')
  }

  // Handle payment status updates
  await handlePaymentStatus(payment)

  return payment
}

const getByUserId = async (userId: string) => {
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