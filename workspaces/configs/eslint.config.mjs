import eslint from '@eslint/js';
import * as eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginReact from 'eslint-plugin-react';
import * as regexPlugin from 'eslint-plugin-regexp';
import eslintPluginSort from 'eslint-plugin-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
const configs = [
  regexPlugin.configs['flat/recommended'],
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
      import: eslintPluginImport,
      react: eslintPluginReact,
      sort: eslintPluginSort,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.strictTypeChecked.at(-1)?.rules,
      ...eslintConfigPrettier.rules,
      ...eslintPluginImport.configs.recommended.rules,
      ...eslintPluginSort.configs.recommended.rules,
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReact.configs['jsx-runtime'].rules,
      '@typescript-eslint/no-invalid-void-type': ['off'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-var-requires': ['off'],
      '@typescript-eslint/only-throw-error': ['off'],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
        },
      ],
      eqeqeq: ['error', 'always', { null: 'never' }],
      'import/no-named-as-default': ['off'],
      'import/no-named-as-default-member': ['off'],
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
          },
          'newlines-between': 'always',
        },
      ],
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          ignoreCase: false,
          reservedFirst: ['key', 'ref'],
          shorthandFirst: true,
        },
      ],
      'sort/imports': ['off'],
      'sort/type-properties': ['error'],
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.cts', '.mts', '.tsx'],
        espree: ['.js', '.cjs', '.mjs', '.jsx'],
      },
      'import/resolver': {
        typescript: {
          conditionNames: ['node', 'require', 'import', 'default'],
        },
      },
      react: {
        version: 'detect',
      },
    },
  },
];

export default configs;
