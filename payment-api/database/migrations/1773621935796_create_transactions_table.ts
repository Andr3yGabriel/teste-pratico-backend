import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('transaction_id').notNullable().unique().primary()
      table
        .uuid('gateway_id')
        .nullable()
        .references('gateway_id')
        .inTable('gateways')
        .onDelete('CASCADE')

      table
        .uuid('client_id')
        .notNullable()
        .references('client_id')
        .inTable('clients')
        .onDelete('CASCADE')

      table.uuid('external_id').unique()
      table.string('status').notNullable()
      table.integer('amount').notNullable()
      table.string('card_last_numbers').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}