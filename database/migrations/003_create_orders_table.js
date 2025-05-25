exports.up = function(knex) {
  return knex.schema.createTable('orders', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('symbol').notNullable();
    table.enum('type', ['MARKET', 'LIMIT', 'STOP_LOSS', 'TAKE_PROFIT', 'STOP_LIMIT']).notNullable();
    table.enum('side', ['BUY', 'SELL']).notNullable();
    table.decimal('quantity', 15, 8).notNullable();
    table.decimal('price', 15, 8);
    table.decimal('stop_price', 15, 8);
    table.enum('status', ['PENDING', 'FILLED', 'PARTIALLY_FILLED', 'CANCELLED', 'REJECTED', 'EXPIRED']).defaultTo('PENDING');
    table.enum('time_in_force', ['GTC', 'IOC', 'FOK', 'DAY']).defaultTo('GTC');
    table.decimal('filled_quantity', 15, 8).defaultTo(0);
    table.decimal('average_price', 15, 8);
    table.decimal('commission', 15, 8).defaultTo(0);
    table.timestamp('expires_at');
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['symbol']);
    table.index(['status']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('orders');
};