
exports.up = (knex, Promise) => {
    return knex.schema
        .createTable('todo', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.boolean('done').notNullable().defaultTo(false);
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
        .dropTableIfExists('todo');
};
