import { TransactionSchema } from '#database/schema'
import { beforeCreate, column } from '@adonisjs/lucid/orm'

export default class Transaction extends TransactionSchema {
    public static primaryKey = 'transaction_id'
    public static selfAssignPrimaryKey = true

    @column({ isPrimary: true, columnName: 'transaction_id' })
    declare transactionId: string

    @beforeCreate()
    public static assignUuid(transaction: Transaction) {
        if (!transaction.transactionId) {
            transaction.transactionId = crypto.randomUUID()
        }
    }
}