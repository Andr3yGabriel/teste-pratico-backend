import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gateways'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('gateway_id').notNullable().unique().primary()
      table.string('name', 100).notNullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.integer('priority').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}