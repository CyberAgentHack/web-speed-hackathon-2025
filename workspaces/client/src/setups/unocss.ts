import initUnocssRuntime, { defineConfig } from '@unocss/runtime';

async function init() {
  await initUnocssRuntime({
    defaults: defineConfig({
      preflights: [],
      presets: [],
    }),
  });
}

init().catch((err: unknown) => {
  throw err;
});
