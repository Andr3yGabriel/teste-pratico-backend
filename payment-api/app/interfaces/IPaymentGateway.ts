import { PaymentDTO } from '#DTOs/PaymentDTO'

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
  gatewayId?: string;
}

export interface RefundResult {
  success: boolean;
  errorMessage?: string;
}

export interface IPaymentGateway {
  processPayment(data: PaymentDTO): Promise<PaymentResult>;
  processRefund(transactionId: string): Promise<RefundResult>;
}