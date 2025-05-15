
import { AbacatePaymentStrategy } from '../types/payment-strategy.types';
import { CreatePaymentDto, Payment } from '../../payments/types/payment.types';
import AbacatePay from 'abacatepay-nodejs-sdk';
import 'dotenv/config';
import {
  CreateCustomerData,
  CreatePixQrCodeData,
  CreatePixQrCodeResponse
} from 'abacatepay-nodejs-sdk/dist/types';

const abacate = AbacatePay(process.env.ABACATEPAY_API_KEY!);

export default class AbacatePaymentService implements AbacatePaymentStrategy {

  public async createPayment(createPaymentDto: CreatePaymentDto): Promise<CreatePixQrCodeResponse> {
    const customer = {
      name: 'Usuário Padrão',         // FUTURAMENTE SERÁ EXTRAIDO DO DTO
      cellphone: '11999999999',
      email: 'usuario@email.com',
      taxId: '12345678900'
    };

    const data: CreatePixQrCodeData = {
      amount: createPaymentDto.amount,
      description: 'Pagamento via Pix com AbacatePay',
      expiresIn: 3600,
      customer
    };
  
    return await abacate.pixQrCode.create(data);
  }

  public async simulatePayment(createPaymentDto: CreatePaymentDto): Promise<CreatePixQrCodeResponse> {
    const customer = {
      name: 'Usuário Padrão',         // FUTURAMENTE SERÁ EXTRAIDO DO DTO
      cellphone: '11999999999',
      email: 'usuario@email.com',
      taxId: '12345678900'
    };

    const data: CreatePixQrCodeData = {
      amount: createPaymentDto.amount,
      description: 'Simulação de pagamento Pix com AbacatePay',
      expiresIn: 3600,
      customer
    };

    return await abacate.pixQrCode.simulatePayment(data);
  }

  public async checkPixStatus(createPaymentDto: CreatePaymentDto): Promise<CreatePixQrCodeResponse> {
    const customer = {
        name: 'Usuário Padrão',         // FUTURAMENTE SERÁ EXTRAIDO DO DTO
      cellphone: '11999999999',
      email: 'usuario@email.com',
      taxId: '12345678900'
    };

    const data: CreatePixQrCodeData = {
      amount: createPaymentDto.amount,
      description: 'Verificação de status do Pix com AbacatePay',
      expiresIn: 3600,
      customer
    };

    return await abacate.pixQrCode.check(data);
  }
}

