#!/usr/bin/env node
/**
 * Spawn Playwright CLI from the Aurora install-root node_modules.
 * Usage (cwd = modules/CoreMobileWebclient/vue-mobile):
 *   node test/e2e/scripts/playwright-cli.js test
 *   node test/e2e/scripts/playwright-cli.js install chromium webkit
 */

const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const vueMobileRoot = path.join(__dirname, '..', '..', '..')
const auroraRoot = path.join(vueMobileRoot, '..', '..', '..')
const nodeModules = path.join(auroraRoot, 'node_modules')
const playwrightBin = path.join(
  nodeModules,
  '.bin',
  process.platform === 'win32' ? 'playwright.cmd' : 'playwright'
)

if (!fs.existsSync(playwrightBin)) {
  console.error(
    `Playwright not found at ${path.join(nodeModules, '@playwright/test')}`
  )
  console.error('From Aurora install root run: npm install')
  process.exit(1)
}

const env = { ...process.env }
env.NODE_PATH = env.NODE_PATH
  ? `${nodeModules}${path.delimiter}${env.NODE_PATH}`
  : nodeModules

const result = spawnSync(playwrightBin, process.argv.slice(2), {
  cwd: vueMobileRoot,
  env,
  stdio: 'inherit',
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status === null ? 1 : result.status)
