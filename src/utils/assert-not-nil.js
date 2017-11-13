'use strict';
const isNil = require('lodash.isnil');
const APIError = require('./api-error');

module.exports = function (item, label = 'Item') {
    if (isNil(item)) {
        throw new APIError(`${label} not found.`, { status: 400 });
    }
    return item;
};
