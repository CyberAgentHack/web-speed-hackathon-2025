import eslint from '@eslint/js';
import * as eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
const configs = [
  {
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.worker,
        ...globals.commonjs,
        ...globals.node,
      },
      parser: /** @type {import('eslint').Linter.Parser} */ (tseslint.parser),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        project: true,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': /** @type {import('eslint').ESLint.Plugin} */ (tseslint.plugin),
      react: eslintPluginReact,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
    },
  },
];

export default configs;
