import { test } from '@japa/runner'

test.group('Checkout Transactions', (group) => {

  test('should process a checkout transaction successfully via Gateway', async ({ client }) => {
    const payload = {
      "products": [
        {
          "product_id": 1,
          "quantity": 2
        },
        {
          "product_id": 2,
          "quantity": 1
        }
      ],
      "client": {
        "name": "tester",
        "email": "user@example.com",
        "cardNumber": "5569000000006063",
        "cvv": "010"
      }
    }

    const response = await client.post('/api/v1/checkout').json(payload)

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Checkout successful',
      order_status: 'paid'
    })
  })
})