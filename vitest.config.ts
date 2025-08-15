import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: './src/test/vitest.setup.ts',
    testTimeout: 30000,
  },
});
