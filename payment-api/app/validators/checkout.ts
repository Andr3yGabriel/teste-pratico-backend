import vine from '@vinejs/vine'

export const checkoutBodyValidator = vine.create({
    products: vine.array(vine.object({
        product_id: vine.string().uuid(),
        quantity: vine.number().positive()
    })),
    client: vine.object({
        name: vine.string(),
        email: vine.string().email(),
        cardNumber: vine.string().fixedLength(16),
        cvv: vine.string().fixedLength(3),
    })
})