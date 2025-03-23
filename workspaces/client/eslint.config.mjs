import configs from '@wsh-2025/configs/eslint.config.mjs';

export default [
  ...configs,
  {
    ignores: ['dist/*', '.wireit/*'],
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
];
