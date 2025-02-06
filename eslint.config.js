const globals = require('globals');
const js = require('@eslint/js');
const jest = require('eslint-plugin-jest');
const security = require('eslint-plugin-security');

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    plugins: {
      jest,
      security
    },
    rules: {
      ...js.configs.recommended.rules,
      ...jest.configs.recommended.rules,
      ...security.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'security/detect-non-literal-fs-filename': 'off',
      'jest/expect-expect': 'off',
      'security/detect-object-injection': 'off',
    }
  }
];