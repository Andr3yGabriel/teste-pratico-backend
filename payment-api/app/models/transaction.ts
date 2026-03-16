import { TransactionSchema } from '#database/schema'
import { beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import Gateway from './gateway.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Transaction extends TransactionSchema {
    public static primaryKey = 'transactionId'
    public static selfAssignPrimaryKey = true

    @column({ isPrimary: true, columnName: 'transaction_id' })
    declare transactionId: string

    @column({ columnName: 'gateway_id' })
    declare gatewayId: string

    @belongsTo(() => Gateway, {
        foreignKey: 'gatewayId',
    })
    declare gateway: BelongsTo<typeof Gateway>

    @beforeCreate()
    public static assignUuid(transaction: Transaction) {
        if (!transaction.transactionId) {
            transaction.transactionId = crypto.randomUUID()
        }
    }
}