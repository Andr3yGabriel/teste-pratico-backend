import { TransactionSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

export default class Transaction extends TransactionSchema {
    public static primaryKey = 'transaction_id'

    @column({ isPrimary: true, columnName: 'transaction_id' })
    declare transactionId: string
}