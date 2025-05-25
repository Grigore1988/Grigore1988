exports.up = function(knex) {
  return knex.schema.createTable('portfolios', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.decimal('cash_balance', 15, 2).defaultTo(0);
    table.decimal('total_value', 15, 2).defaultTo(0);
    table.decimal('day_change', 15, 2).defaultTo(0);
    table.decimal('day_change_percent', 8, 4).defaultTo(0);
    table.decimal('total_return', 15, 2).defaultTo(0);
    table.decimal('total_return_percent', 8, 4).defaultTo(0);
    table.timestamps(true, true);
    
    table.index(['user_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('portfolios');
};