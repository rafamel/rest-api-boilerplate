const fs = require('fs');

module.exports = {
  APP_NAME: JSON.parse(fs.readFileSync('./package.json')).name,
  DOCS_DIR: 'docs',
  CONFIG_DIR: __dirname,
  EXTENSIONS: 'js,mjs,jsx,ts,tsx',
  TYPESCRIPT: true
};
