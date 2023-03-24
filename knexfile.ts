require('dotenv').config({ path: './.env' })
import { Config } from 'knex'

interface KnexConfig {
  [key: string]: Config
}

const config: KnexConfig = {
  all: {
    client: 'pg',
    connection: process.env.DB_CONNECTION_STRING,
    migrations: {
      tableName: 'knex_migrations',
      directory: 'migrations',
    },
  },
}

module.exports = config
