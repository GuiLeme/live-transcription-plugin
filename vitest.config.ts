import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['tests/unit/setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/components/**/utils.ts'],
      reporter: ['text', 'lcov'],
    },
  },
});
