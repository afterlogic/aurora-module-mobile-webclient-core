// @ts-check
const fs = require('fs')
const path = require('path')
const { defineConfig, devices } = require('@playwright/test')

/** CoreMobileWebclient/vue-mobile — runner package root */
const mobileE2eRoot = __dirname
/** Aurora install root (parent of modules/) */
const auroraRoot = path.join(__dirname, '..', '..', '..')

process.env.AURORA_MOBILE_E2E_ROOT = mobileE2eRoot
process.env.AURORA_ROOT = auroraRoot

const runnerNodeModules = path.join(mobileE2eRoot, 'node_modules')
const prevNodePath = process.env.NODE_PATH || ''
if (!prevNodePath.split(path.delimiter).includes(runnerNodeModules)) {
  process.env.NODE_PATH = prevNodePath
    ? `${runnerNodeModules}${path.delimiter}${prevNodePath}`
    : runnerNodeModules
  // eslint-disable-next-line no-underscore-dangle
  require('module').Module._initPaths()
}

function loadEnvE2e() {
  const envPath = path.join(mobileE2eRoot, '.env.e2e')
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
 * Discover modules/<Name>/vue-mobile/test/e2e that contain at least one *.spec.js.
 */
function discoverModuleE2eDirs() {
  const modulesRoot = path.join(auroraRoot, 'modules')
  if (!fs.existsSync(modulesRoot)) {
    return []
  }

  return fs
    .readdirSync(modulesRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const moduleName = d.name
      const testDir = path.join(
        modulesRoot,
        moduleName,
        'vue-mobile',
        'test',
        'e2e'
      )
      return { moduleName, testDir }
    })
    .filter(({ testDir }) => {
      if (!fs.existsSync(testDir) || !fs.statSync(testDir).isDirectory()) {
        return false
      }
      return fs.readdirSync(testDir).some((f) => f.endsWith('.spec.js'))
    })
    .sort((a, b) => a.moduleName.localeCompare(b.moduleName))
}

const browsers = [
  {
    name: 'iPhone SE',
    use: { ...devices['iPhone SE'], browserName: 'chromium' },
  },
  {
    name: 'iPhone 13',
    use: { ...devices['iPhone 13'], browserName: 'chromium' },
  },
  {
    name: 'Pixel 7',
    use: { ...devices['Pixel 7'], browserName: 'chromium' },
  },
  {
    name: 'iPhone SE WebKit',
    use: { ...devices['iPhone SE'], browserName: 'webkit' },
  },
  {
    name: 'iPhone 13 WebKit',
    use: { ...devices['iPhone 13'], browserName: 'webkit' },
  },
]

const moduleDirs = discoverModuleE2eDirs()

/** @type {import('@playwright/test').Project[]} */
const projects = []
for (const browser of browsers) {
  for (const { moduleName, testDir } of moduleDirs) {
    projects.push({
      name: `${moduleName} · ${browser.name}`,
      testDir,
      testMatch: '*.spec.js',
      use: { ...browser.use },
    })
  }
}

if (projects.length === 0) {
  console.warn(
    '[mobile e2e] No modules/*/vue-mobile/test/e2e/*.spec.js found under',
    path.join(auroraRoot, 'modules')
  )
}

/**
 * Mobile E2E against a locally running Aurora instance (MAMP / PHP).
 * Specs live in modules/<Name>/vue-mobile/test/e2e/; this package is the runner.
 * Override URL: PLAYWRIGHT_BASE_URL=http://localhost:8888/?mobile-version
 */
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8888/?mobile-version'

module.exports = defineConfig({
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  timeout: 120000,
  expect: {
    timeout: 15000,
  },
  reporter: [
    ['list', { printSteps: true }],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL,
    testIdAttribute: 'data-test-id',
    actionTimeout: 20000,
    navigationTimeout: 45000,
    trace: process.env.CI ? 'on-first-retry' : 'on',
    screenshot: 'only-on-failure',
  },
  projects,
})
