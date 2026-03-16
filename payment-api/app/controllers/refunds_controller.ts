import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import { PaymentService } from '#services/PaymentService'

export default class RefundsController {
  async handle({ params, response }: HttpContext) {
    const transactionId = params.id
    const paymentService = new PaymentService()

    const transaction = await Transaction.find(transactionId)
    if (!transaction || transaction.status !== 'paid') {
      return response.badRequest({ message: 'Valid paid transaction not found' })
    }

    const result = await paymentService.refund(transaction)

    console.log('Refund result:', result)

    if (result.success) {
      transaction.status = 'refunded'
      await transaction.save()
      
      return response.ok({
        message: 'Refund successful',
        order_status: 'refunded'
      })
    }

    return response.badRequest({
      message: 'Refund failed',
      error: result.errorMessage
    })
  }
}