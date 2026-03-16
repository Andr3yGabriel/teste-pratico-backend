import { ClientSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

export default class Client extends ClientSchema {
    public static primaryKey = 'client_id'

    @column({ isPrimary: true, columnName: 'client_id' })
    declare clientId: string
}