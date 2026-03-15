import type { HttpContext } from '@adonisjs/core/http'

export default class CheckoutsController {
    async handle({response}: HttpContext) {
        return response.status(201).json({
            message: 'Checkout successful',
            order_status: 'paid'
        });
    }
}