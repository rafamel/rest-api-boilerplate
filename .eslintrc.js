module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: ['standard', 'prettier'],
  env: {
    node: true,
    jest: true
  },
  parserOptions: {
    impliedStrict: true
  },
  plugins: ['prettier', 'jest', 'import', 'babel'],
  globals: {},
  rules: {
    'no-warning-comments': [
      1,
      { terms: ['xxx', 'fixme', 'todo', 'refactor'], location: 'start' }
    ],
    'no-console': 1,
    // eslint-plugin-babel
    'babel/no-invalid-this': 1,
    'babel/semi': 1,
    // Prettier
    'prettier/prettier': [2, require('./.prettierrc')]
  },
  settings: {
    // babel-plugin-module-resolver
    'import/resolver': {
      'babel-module': {}
    }
  }
};
