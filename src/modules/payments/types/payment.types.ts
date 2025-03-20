export interface Payment {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  createdAt: Date
  updatedAt: Date
}

export interface CreatePaymentDto {
  amount: number
  currency: string
  paymentMethod: string
  customerId: string
}

export interface UpdatePaymentDto {
  status: Payment['status']
  statusReason?: string
} 