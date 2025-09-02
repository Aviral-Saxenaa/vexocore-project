const knex = require('knex');

// Database configuration for Neon PostgreSQL
const config = {
    client: 'postgresql',
    connection: {
        host: 'ep-hidden-tooth-adygdcyo-pooler.c-2.us-east-1.aws.neon.tech',
        port: 5432,
        user: 'neondb_owner',
        password: 'npg_xQDtVNid6pm8',
        database: 'neondb',
        ssl: { rejectUnauthorized: false }
    },
    pool: {
        min: 2,
        max: 10
    }
};

async function setupDatabase() {
    let db;
    try {
        console.log('🔄 Setting up Neon PostgreSQL database...');

        db = knex(config);

        // Test connection
        await db.raw('SELECT 1');
        console.log('✅ Connected to Neon database successfully');

        // Create users table
        const usersExists = await db.schema.hasTable('users');
        if (!usersExists) {
            await db.schema.createTable('users', (table) => {
                table.increments('id').primary();
                table.string('email').unique().notNullable();
                table.string('username').unique().notNullable();
                table.string('password_hash').notNullable();
                table.string('first_name');
                table.string('last_name');
                table.timestamps(true, true);
            });
            console.log('✅ Users table created');
        } else {
            console.log('ℹ️  Users table already exists');
        }

        // Create tasks table
        const tasksExists = await db.schema.hasTable('tasks');
        if (!tasksExists) {
            await db.schema.createTable('tasks', (table) => {
                table.increments('id').primary();
                table.string('title').notNullable();
                table.text('description');
                table.boolean('completed').defaultTo(false);
                table.string('priority').defaultTo('medium');
                table.date('due_date');
                table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
                table.timestamps(true, true);
            });
            console.log('✅ Tasks table created');
        } else {
            console.log('ℹ️  Tasks table already exists');
        }

        console.log('✅ Database setup completed successfully!');

    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    } finally {
        if (db) {
            await db.destroy();
        }
        process.exit(0);
    }
}

setupDatabase();