import axios from 'axios'
import env from '#start/env'
import { IPaymentGateway, PaymentResult } from '#Interfaces/IPaymentGateway'
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
}