// @ts-check
const fs = require('fs')
const path = require('path')
const { defineConfig, devices } = require('@playwright/test')

function loadEnvE2e() {
  const envPath = path.join(__dirname, '.env.e2e')
  if (!fs.existsSync(envPath)) {
    return
  }

  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach((line) => {
      const match = line.match(/^([^#=]+)=(.*)$/)
      if (match && !process.env[match[1].trim()]) {
        process.env[match[1].trim()] = match[2].trim()
      }
    })
}

loadEnvE2e()

/**
 * Mobile E2E against a locally running Aurora instance (MAMP / PHP).
 * Override URL: PLAYWRIGHT_BASE_URL=http://localhost:8888/?mobile-version
 */
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8888/?mobile-version'

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  // One retry catches rare Turnstile/IMAP races without hiding real bugs.
  retries: 1,
  workers: 1,
  timeout: 120000,
  expect: {
    timeout: 15000,
  },
  // list = console; html = open with `yarn test:e2e:report`
  reporter: [
    ['list', { printSteps: true }],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL,
    testIdAttribute: 'data-test-id',
    actionTimeout: 20000,
    navigationTimeout: 45000,
    // Local: keep a timeline for every run (view in HTML report).
    // CI: only on retry to save space.
    trace: process.env.CI ? 'on-first-retry' : 'on',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'iPhone SE',
      use: {
        ...devices['iPhone SE'],
        browserName: 'chromium',
      },
    },
    {
      name: 'iPhone 13',
      use: {
        ...devices['iPhone 13'],
        browserName: 'chromium',
      },
    },
    {
      name: 'Pixel 7',
      use: {
        ...devices['Pixel 7'],
        browserName: 'chromium',
      },
    },
    // Playwright WebKit (Safari engine) — not real Mobile Safari, but catches WebKit-only issues.
    {
      name: 'iPhone SE WebKit',
      use: {
        ...devices['iPhone SE'],
        browserName: 'webkit',
      },
    },
    {
      name: 'iPhone 13 WebKit',
      use: {
        ...devices['iPhone 13'],
        browserName: 'webkit',
      },
    },
  ],
})
