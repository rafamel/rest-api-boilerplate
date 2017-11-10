
exports.up = (knex, Promise) => {
    return knex.schema
        .createTable('users', (table) => {
            table.increments('id').primary();
            table.string('username').unique().notNullable();
            table.string('email').unique().notNullable();
            table.string('hash').notNullable();
            table.timestamps(true, true);
        })
        .createTable('refresh_token', (table) => {
            table.increments('id').primary();
            table.string('token').notNullable();
            table.datetime('expires').notNullable();
            table
                .integer('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE')
                .notNullable();
            table.timestamps(true, true);
        });
};

exports.down = (knex, Promise) => {
    return knex.schema
        .dropTableIfExists('refresh_token')
        .dropTableIfExists('users');
};
