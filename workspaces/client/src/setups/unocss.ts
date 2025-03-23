import presetWind3 from '@unocss/preset-wind3';
import initUnocssRuntime, { defineConfig } from '@unocss/runtime';

async function init() {
  await initUnocssRuntime({
    defaults: defineConfig({
      presets: [presetWind3()],
    }),
  });
}

init().catch((err: unknown) => {
  throw err;
});
