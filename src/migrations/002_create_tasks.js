/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tasks', function(table) {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('description');
    table.boolean('completed').defaultTo(false);
    table.enum('priority', ['low', 'medium', 'high']).defaultTo('medium');
    table.date('due_date');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
    
    // Indexes for performance
    table.index('user_id');
    table.index('completed');
    table.index('priority');
    table.index('due_date');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
};
