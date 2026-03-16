import db from '@adonisjs/lucid/services/db';
import type { HttpContext } from '@adonisjs/core/http'
import { checkoutBodyValidator } from '#validators/checkout';
import { PaymentService } from '#services/PaymentService';
import { PaymentDTO } from '#DTOs/PaymentDTO';
import { UUID } from 'crypto';
import Product from '#models/product';
import Client from '#models/client';
import Transaction from '#models/transaction';
import TransactionProduct from '#models/transaction_product';

export default class CheckoutsController {
    async handle({response, request}: HttpContext) {
        const paymentService = new PaymentService();
        const bodyData = await checkoutBodyValidator.validate(request.body());

        const products = bodyData.products as { product_id: UUID, quantity: number }[];

        const itemTotals = await Product.query().whereIn('product_id', products.map(p => p.product_id)).then(dbProducts => {
            return dbProducts.map(dbProduct => {
                const quantity = products.find(p => p.product_id === dbProduct.productId)?.quantity || 0;
                return dbProduct.amount * quantity;
            });
        });

        const calculated_amount = itemTotals.reduce((total, itemTotal) => total + itemTotal, 0)

        const trx = await db.transaction()

        let pendingTransaction: Transaction;

        try {
            const client = await Client.firstOrCreate(
                { email: bodyData.client.email },
                { name: bodyData.client.name },
                { client: trx }
            )

            pendingTransaction = await Transaction.create({
                clientId: client.clientId,
                amount: calculated_amount,
                status: 'pending',
                cardLastNumbers: bodyData.client.cardNumber.slice(-4),
            }, { client: trx })

            const pivotData = products.map(p => ({
                transactionId: pendingTransaction.transactionId,
                productId: p.product_id,
                quantity: p.quantity,
            }))
            await TransactionProduct.createMany(pivotData, { client: trx })

            await trx.commit()
        } catch (error) {
            await trx.rollback()
            return response.internalServerError({ error: 'Failed to create transaction' })
        }

        const paymentData: PaymentDTO = {
            amount: calculated_amount,
            clientName: bodyData.client.name,
            clientEmail: bodyData.client.email,
            cardNumber: bodyData.client.cardNumber,
            cvv: bodyData.client.cvv,
        }

        const paymentResult = await paymentService.processPayment(paymentData);
        if (paymentResult.success && paymentResult.transactionId && paymentResult.gatewayId) {
            pendingTransaction.status = 'paid';
            pendingTransaction.externalId = paymentResult.transactionId;
            pendingTransaction.gatewayId = paymentResult.gatewayId;
            await pendingTransaction.save();
            return response.created({
                message: 'Checkout successful',
                transaction_id: pendingTransaction.transactionId,
            });
        } else {
            pendingTransaction.status = 'failed';
            await pendingTransaction.save();

            return response.badRequest({
                message: 'Payment failed',
                error: paymentResult.errorMessage || 'Unknown error',
            });
        }
    }
}