import { defineConfig, devices } from '@playwright/test';
import {
  CI,
  ELEMENT_WAIT_LONGER_TIME,
  ELEMENT_WAIT_TIME,
} from './tests/core/constants';
import { server } from './tests/core/parameters';

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/unit/**'],
  workers: CI ? 1 : undefined,
  retries: CI ? 1 : 0,
  fullyParallel: true,
  forbidOnly: CI,
  reporter: CI ? [['blob']] : [['list'], ['html', { open: 'never' }]],
  timeout: 120000,
  use: {
    baseURL: server,
    headless: true,
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    actionTimeout: ELEMENT_WAIT_LONGER_TIME,
    viewport: { width: 1280, height: 720 },
    permissions: ['clipboard-read', 'clipboard-write', 'camera', 'microphone'],
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    },
  },
  projects: [{
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      launchOptions: {
        executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
        args: [
          '--no-sandbox',
          '--ignore-certificate-errors',
          '--use-fake-ui-for-media-stream',
          '--use-fake-device-for-media-stream',
        ],
      },
    },
  }],
  expect: {
    timeout: ELEMENT_WAIT_TIME,
  },
});
