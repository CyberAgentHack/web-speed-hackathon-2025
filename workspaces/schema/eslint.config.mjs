import configs from '@wsh-2025/configs/eslint.config.mjs';

export default [
  ...configs,
  {
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
];

