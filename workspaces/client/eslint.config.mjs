import configs from '@wsh-2025/configs/eslint.config.mjs';

export default [
  ...configs,
  {
    ignores: ['dist/*', '.wireit/*'],
    rules: {
      "react/jsx-sort-props": "off",
      "regexp/no-unused-capturing-group": "off",
    }
  },
];
