exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('phone_number');
    table.boolean('is_email_verified').defaultTo(false);
    table.boolean('is_phone_verified').defaultTo(false);
    table.boolean('two_factor_enabled').defaultTo(false);
    table.string('two_factor_secret');
    table.string('email_verification_token');
    table.string('password_reset_token');
    table.timestamp('password_reset_expires');
    table.timestamp('last_login');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    table.index(['email']);
    table.index(['is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};