const knex = require('knex');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const config = {
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_xQDtVNid6pm8@ep-hidden-tooth-adygdcyo-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
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
    useNullAsDefault: true
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};

const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

db.raw('SELECT 1')
  .then(() => {
    console.log(`✅ Database connected successfully (${environment} mode)`);
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });

module.exports = db;