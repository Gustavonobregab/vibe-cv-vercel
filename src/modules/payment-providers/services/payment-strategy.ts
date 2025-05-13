// payment-strategy.factory.ts
import { PaymentStrategy } from '../types/payment-strategy.types';
import { CreatePaymentDto } from '../../payments/types/payment.types';
import AbacatePaymentService from '../abacate/abacate.service';
import PagarmePaymentService from '../pagarme/pagarme.service';

const PaymentStrategyFactory = {
  getStrategy(payment: CreatePaymentDto): PaymentStrategy {
    switch (payment.paymentMethod) {
      case 'abacate':
        return new AbacatePaymentService();
      case 'pagarme':
        return new PagarmePaymentService();
      default:
        throw new Error(`Unsupported payment provider: ${payment.paymentMethod}`);
    }
  }
};

export default PaymentStrategyFactory;