import { PagarmePaymentStrategy } from '../types/payment-strategy.types';
import { CreatePaymentDto } from '../../payments/types/payment.types';

export default class PagarmePaymentService implements PagarmePaymentStrategy {
  private client: any;

  constructor() {
   // this.client = pagarme.client.connect({ api_key: process.env.PAGARME_API_KEY });
  }

  public async createPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
   /* const transaction = await this.client.transactions.create({
      amount: createPaymentDto.amount,
      payment_method: createPaymentDto.paymentMethod,
      // Adicione outros campos necessários dependendo do Pagarme
    });
    return transaction; */
  }

  public async createCreditCardPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
     /* const transaction = await this.client.transactions.create({
      amount: createPaymentDto.amount,
      payment_method: 'credit_card', // Definindo o método como 'cartão de crédito'
      card_number: createPaymentDto.paymentDetails?.cardNumber,
      card_expiration_date: createPaymentDto.paymentDetails?.cardExpirationDate,
      card_cvv: createPaymentDto.paymentDetails?.cardCvv,
      // Adicione outros campos necessários para o pagamento com cartão de crédito
    });
    return transaction; */
  }

  public async checkTransactionStatus(createPaymentDto: CreatePaymentDto): Promise<any> {
   /* const transaction = await this.client.transactions.find(createPaymentDto.transactionId);
    return transaction; */
  } 
}
