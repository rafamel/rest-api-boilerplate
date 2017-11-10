'use strict';
const path = require('path');

module.exports = (baseDir = path.dirname(module.parent.filename)) => {
    global.rootRequire = (...args) => require(path.join(baseDir, ...args));
};
