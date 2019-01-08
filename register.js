const { EXTENSIONS } = require('./project.config');

// https://github.com/babel/babel/issues/8652
require('@babel/register')({
  extensions: EXTENSIONS.split(',').map((x) => '.' + x)
});
