import { GatewaySchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

export default class Gateway extends GatewaySchema {
    public static primaryKey = 'gateway_id'

    @column({ isPrimary: true, columnName: 'gateway_id' })
    declare gatewayId: string
}