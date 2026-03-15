import { column } from '@adonisjs/lucid/orm'
import { ProductSchema } from '#database/schema'

export default class Product extends ProductSchema {
    public static primaryKey = 'product_id'

    @column({ isPrimary: true, columnName: 'product_id' })
    declare productId: string
}