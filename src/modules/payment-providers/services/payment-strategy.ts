import { PaymentStrategy } from '../types/payment-strategy.types';
import { CreatePaymentDto } from '../../payments/types/payment.types';
import AbacatePaymentService from '../abacate/abacate.service';
import PagarmePaymentService from '../pagarme/pagarme.service';

export class PaymentStrategyFactory {
  static getStrategy(payment: CreatePaymentDto): PaymentStrategy {
    switch (payment.paymentMethod) {
      case 'abacate':
        return new AbacatePaymentService();
      case 'pagarme':
        return new PagarmePaymentService();
      default:
        throw new Error(`Unsupported payment provider: ${payment.paymentMethod}`);
    }
  }
}
