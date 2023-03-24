import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  const user = knex.schema.createTable('user', table => {
    table.increments()
    table.string('username')
    table.string('password')
    table.string('role').defaultTo('regular')
  })

  const message = knex.schema.createTable('message', table => {
    table.increments()
    table.string('trigger').unique('message_trigger_unique')
    table.string('content')
  })

  return Promise.all([user, message])
}

export async function down(knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.dropTable('user'),
    knex.schema.dropTable('message'),
  ])
}
