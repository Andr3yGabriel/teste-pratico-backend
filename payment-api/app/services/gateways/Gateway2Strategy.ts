import axios from 'axios'
import env from '#start/env'
import { IPaymentGateway, PaymentResult, RefundResult } from '#Interfaces/IPaymentGateway'
import { PaymentDTO } from '#DTOs/PaymentDTO'

export class Gateway2Strategy implements IPaymentGateway {
    private httpClient = axios.create({
        baseURL: env.get('GATEWAY2_URL'),
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    async processPayment(data: PaymentDTO): Promise<PaymentResult> {
        if (data.cvv === '200' || data.cvv === '300') {
            return {
                success: false,
                errorMessage: 'Invalid card'
            }
        }
        try {
            const transactionResponse = await this.httpClient.post('/transacoes', {
                valor: data.amount,
                nome: data.clientName,
                email: data.clientEmail,
                numeroCartao: data.cardNumber,
                cvv: data.cvv
            }, {
                headers: {
                    'Gateway-Auth-Token': env.get('GATEWAY2_AUTH_TOKEN'),
                    'Gateway-Auth-Secret': env.get('GATEWAY2_AUTH_SECRET')
                }
            })

            return {
                success: transactionResponse.status === 201,
                transactionId: transactionResponse.data.transactionId
            }
        }
        catch (error) {
            return {
                success: false,
                errorMessage: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    }

    async processRefund(transactionId: string): Promise<RefundResult> {
        try {
            const response = await this.httpClient.post(`/transacoes/reembolso`, {
                id: transactionId
            }, {
                headers: {
                    'Gateway-Auth-Token': env.get('GATEWAY2_AUTH_TOKEN'),
                    'Gateway-Auth-Secret': env.get('GATEWAY2_AUTH_SECRET')
                }
            })

            return {
                success: response.status === 200
            }
        } catch (error) {
            return {
                success: false,
                errorMessage: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    }
}