import { createRequire } from 'node:module';

import { defineConfig } from 'drizzle-kit';

const require = createRequire(import.meta.url);

export default defineConfig({
  dbCredentials: {
    url: 'file:./database.sqlite',
  },
  dialect: 'sqlite',
  out: './migrations',
  schema: require.resolve('@wsh-2025/schema/src/database/schema.ts'),
});
