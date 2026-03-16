import { GatewaySchema } from '#database/schema'
import { beforeCreate, column } from '@adonisjs/lucid/orm'

export default class Gateway extends GatewaySchema {
    public static primaryKey = 'gateway_id'
    public static selfAssignPrimaryKey = true

    @column({ isPrimary: true, columnName: 'gateway_id' })
    declare gatewayId: string

    @beforeCreate()
    static assignUuid(gateway: Gateway) {
        if (!gateway.gatewayId) {
            gateway.gatewayId = crypto.randomUUID()
        }
    }
}