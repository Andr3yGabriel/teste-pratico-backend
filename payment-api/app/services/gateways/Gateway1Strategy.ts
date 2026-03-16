import axios from 'axios'
import env from '#start/env'
import { IPaymentGateway, PaymentResult } from '#Interfaces/IPaymentGateway'
import { PaymentDTO } from '#DTOs/PaymentDTO'

export class Gateway1Strategy implements IPaymentGateway {
    private httpClient = axios.create({
        baseURL: env.get('GATEWAY1_URL'),
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    async processPayment(data: PaymentDTO): Promise<PaymentResult> {
        if (data.cvv === '200' || data.cvv === '100') {
            return {
                success: false,
                errorMessage: 'Invalid card'
            }
        }
        try {
            const response = await this.httpClient.post('/login', {
                email: env.get('LOGIN_ROUTE_EMAIL'),
                token: env.get('LOGIN_ROUTE_TOKEN'),
            })

            if (response.status === 200 && response.data.token) {
                const transactionResponse = await this.httpClient.post('/transactions', {
                    amount: data.amount,
                    name: data.clientName,
                    email: data.clientEmail,
                    cardNumber: data.cardNumber,
                    cvv: data.cvv
                }, {
                    headers: {
                        'Authorization': `Bearer ${response.data.token}`
                    }
                })

                return {
                    success: transactionResponse.status === 201,
                    transactionId: transactionResponse.data.transactionId
                }
            }

            return {
                success: false,
                errorMessage: 'Authentication failed'
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