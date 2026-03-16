import { ClientSchema } from '#database/schema'
import { beforeCreate, column } from '@adonisjs/lucid/orm'

export default class Client extends ClientSchema {
    public static primaryKey = 'client_id'
    public static selfAssignPrimaryKey = true

    @column({ isPrimary: true, columnName: 'client_id' })
    declare clientId: string

    @beforeCreate()
    static assignUuid(client: Client) {
        if (!client.clientId) {
            client.clientId = crypto.randomUUID()
        }
    }
}