import { test } from '@japa/runner'
import Product from '#models/product'
import Gateway from '#models/gateway'
import crypto from 'crypto'
import Transaction from '#models/transaction'
import Client from '#models/client'

test.group('Checkout Transactions', (group) => {
  
  test('should process a checkout transaction successfully via Gateway', async ({ client, assert }) => {
    const productId1 = crypto.randomUUID()
    const productId2 = crypto.randomUUID()

    await Product.createMany([
      { productId: productId1, name: 'Teclado Mecânico', amount: 35000 },
      { productId: productId2, name: 'Mouse Gamer', amount: 15000 }
    ])
    await Gateway.create({
      gatewayId: crypto.randomUUID(),
      name: 'Gateway 1',
      isActive: true,
      priority: 1
    })
    const payload = {
        products: [
            { product_id: productId1, quantity: 2 },
            { product_id: productId2, quantity: 1 }
        ],
        client: {
            clientId: crypto.randomUUID(),
            name: "tester",
            email: "user@example.com",
            cardNumber: "5569000000006063",
            cvv: "010"
        }
    }
    const response = await client.post('/api/v1/checkout').json(payload)
    response.assertBodyContains({
      message: 'Checkout successful'
    })
    assert.property(response.body(), 'transaction_id')
  })
})

test.group('Refund Transactions', (group) => {
  test('should process a refund transaction succesfully via Gateway', async ({client}) => {
    const getaway = await Gateway.create({
      gatewayId: crypto.randomUUID(),
      name: 'Gateway 1',
      isActive: true,
      priority: 1
    })

    const dbClient = await Client.create({
      name: 'Tester Refund',
      email: 'refund@test.com'
    })

    const transaction = await Transaction.create({
      transactionId: crypto.randomUUID(),
      gatewayId: getaway.gatewayId,
      clientId: dbClient.clientId,
      amount: 50000,
      status: 'paid',
      cardLastNumbers: '6063'
    })
    const payload = {
      transaction_id: transaction.transactionId,
    }

    const response = await client.post('/api/v1/refund/:id').json(payload)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Refund successful',
      order_status: 'refunded'
    })
  })
})