import { beforeCreate, column } from '@adonisjs/lucid/orm'
import { ProductSchema } from '#database/schema'

export default class Product extends ProductSchema {
    public static primaryKey = 'product_id'
    public static selfAssignPrimaryKey = true

    @column({ isPrimary: true, columnName: 'product_id' })
    declare productId: string

    @beforeCreate()
    static assignUuid(product: Product) {
        if (!product.productId) {
            product.productId = crypto.randomUUID()
        }
    }
}