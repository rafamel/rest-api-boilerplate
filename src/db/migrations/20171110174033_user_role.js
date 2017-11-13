
exports.up = function (knex, Promise) {
    return knex.schema
        .table('users', (table) => {
            table.integer('role').notNullable().defaultTo(0);
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('users', (table) => {
            table.dropColumn('role');
        });
};
