const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_xQDtVNid6pm8@ep-hidden-tooth-adygdcyo-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
    migrations: {
      directory: path.join(__dirname, '../migrations')
    },
    seeds: {
      directory: path.join(__dirname, '../seeds')
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, '../migrations')
    }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    migrations: {
      directory: path.join(__dirname, '../migrations')
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};