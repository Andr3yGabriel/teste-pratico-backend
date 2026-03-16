import { test } from '@japa/runner'
import Product from '#models/product'
import Gateway from '#models/gateway'
import crypto from 'crypto'
import Transaction from '#models/transaction'

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
    const response  = await client.post('/api/v1/checkout').json(payload)
    response.assertBodyContains({
      message: 'Checkout successful'
    })
    assert.property(response.body(), 'transaction_id')

    await Transaction.query().delete()
    await Product.query().delete()
    await Gateway.query().delete()
  })
})

test.group('Refund Transactions', (group) => {
  test('should process a refund transaction succesfully via Gateway', async ({client, assert}) => {
    await Gateway.create({ name: 'Gateway 1', isActive: true, priority: 1 })
    const product = await Product.create({ name: 'Item Teste', amount: 10000 })

    const checkoutPayload = {
        products: [{ product_id: product.productId, quantity: 1 }],
        client: {
            name: "Tester Refund",
            email: "refund@example.com",
            cardNumber: "5569000000006063",
            cvv: "010"
        }
    }

    const checkoutResponse = await client.post('/api/v1/checkout').json(checkoutPayload)
    const transactionId = (checkoutResponse.body() as any).transaction_id

    const response = await client.post(`/api/v1/refund/${transactionId}`)
    response.assertBodyContains({
      message: 'Refund successful',
      order_status: 'refunded'
    })
    response.assertStatus(200)

    const updatedTransaction = await Transaction.findOrFail(transactionId)
    assert.equal(updatedTransaction.status, 'refunded')

    await Transaction.query().delete()
    await Product.query().delete()
    await Gateway.query().delete()
  })

  test('should process a refund transaction successfully via Gateway 2', async ({ client, assert }) => {
  await Gateway.create({ 
    name: 'Gateway 2', 
    isActive: true, 
    priority: 1 
  })
  const product = await Product.create({ name: 'Produto G2', amount: 25000 })

  const checkoutPayload = {
    products: [{ product_id: product.productId, quantity: 1 }],
    client: {
      name: "Tester G2",
      email: "g2@test.com",
      cardNumber: "5569000000006063",
      cvv: "010"
    }
  }
  const checkoutResponse = await client.post('/api/v1/checkout').json(checkoutPayload)
  const transactionId = (checkoutResponse.body() as any).transaction_id

  const response = await client.post(`/api/v1/refund/${transactionId}`)

  response.assertBodyContains({
    message: 'Refund successful',
    order_status: 'refunded'
  })
  response.assertStatus(200)

  const updatedTransaction = await Transaction.findOrFail(transactionId)
  assert.equal(updatedTransaction.status, 'refunded')

  await Transaction.query().delete()
  await Product.query().delete()
  await Gateway.query().delete()
})
})