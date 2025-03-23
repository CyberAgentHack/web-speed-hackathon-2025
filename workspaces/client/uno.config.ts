import { defineConfig, presetIcons, presetWind3 } from 'unocss';

export default defineConfig({
  layers: {
    default: 1,
    icons: 0,
    preflights: 0,
    reset: -1,
  },
  presets: [presetWind3(), presetIcons()],
});
