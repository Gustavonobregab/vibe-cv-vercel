import { CreatePixQrCodeResponse } from 'abacatepay-nodejs-sdk/dist/types';
import { CreatePaymentDto } from '../../payments/types/payment.types';

// Tipo de pagamento para AbacatePay
export interface AbacatePaymentStrategy {
  createPayment(data: CreatePaymentDto): Promise<CreatePixQrCodeResponse>;
  simulatePayment(data: CreatePaymentDto): Promise<CreatePixQrCodeResponse>;
  checkPixStatus(data: CreatePaymentDto): Promise<CreatePixQrCodeResponse>;
}

// Tipo de pagamento para Pagarme
export interface PagarmePaymentStrategy {
  createPayment(data: CreatePaymentDto): Promise<any>; // IMPLEMENTAR
  createCreditCardPayment(data: CreatePaymentDto): Promise<any>; // IMPLEMENTAR
  checkTransactionStatus(data: CreatePaymentDto): Promise<any>; // IMPLEMENTAR
}

// Agora, em vez de um único tipo PaymentStrategy, você tem dois tipos específicos
export type PaymentStrategy = AbacatePaymentStrategy | PagarmePaymentStrategy;
