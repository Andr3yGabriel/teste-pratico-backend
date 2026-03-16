import { PaymentDTO } from '#DTOs/PaymentDTO'

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
  gatewayId?: string;
}

export interface IPaymentGateway {
  processPayment(data: PaymentDTO): Promise<PaymentResult>;
}