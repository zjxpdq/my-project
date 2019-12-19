module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "plugin:vue/essential",
    "google"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "plugins": [
    "vue"
  ],
  "rules": {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'semi': 0,
    'no-multiple-empty-lines': [1, {'max': 2}],
    'no-mixed-spaces-and-tabs': [1],
    'indent': [0, 2],
    'max-len': [0, {'code': 300}],
    'no-extra-parens': 2,
    'no-extra-semi': 2,
    'no-multi-spaces': 2,
    'comma-dangle': [2, 'never'],
    'no-irregular-whitespace': 2,
    'no-regex-spaces': 2,
    'comma-spacing': [2, {'before': false, 'after': true}],
    'eol-last': 2,
    'no-empty': 2,
    'no-sparse-arrays': 2,
    'use-isnan': 2,
    'no-script-url': 2,
    'no-unused-expressions': 2,
    'wrap-iife': [2, 'any'],
    'no-shadow-restricted-names': 2,
    'camelcase': [2, {'properties': 'never'}],
    'comma-style': [2, 'last'],
    'newline-after-var': 0,
    'no-trailing-spaces': 2,
    'padded-blocks': [2, 'never'],
    'quotes': [0, 'single', 'avoid-escape'],
    'vue/no-parsing-error': [0, {'x-invalid-end-tag': false}],
    "no-new-func": 1,
    "no-new-object": 2,
    "no-new-require": 2,
    "no-spaced-func": 2,
    "space-before-function-paren": [0, "always"],
    'linebreak-style': [0, "windows"],
    "prefer-const": 0,
    "vue/return-in-computed-property": 0,
    "vue/valid-v-bind": 0,
    "valid-jsdoc": 0,
    "guard-for-in": 0,
    "prefer-promise-reject-errors": 0
  }
}
