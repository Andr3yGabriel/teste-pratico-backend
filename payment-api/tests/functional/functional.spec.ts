import { test } from '@japa/runner'
import Product from '#models/product'
import Gateway from '#models/gateway'
import crypto from 'crypto'

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