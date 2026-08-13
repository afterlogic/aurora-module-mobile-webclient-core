#!/usr/bin/env node
/**
 * Spawn Playwright CLI from the Aurora install-root node_modules.
 *
 * For `test`, translates --setup "modules devices" into Playwright --project
 * flags (same idea as CoreWebclient/test/e2e/scripts/run-e2e.js):
 *   --setup "MailMobileWebclient iPhone13"
 *   --setup "MailMobileWebclient,ContactsMobileWebclient iPhone13,Pixel7"
 *   --setup "* iPhone13"                         # all modules · iPhone13
 *
 * Project names are Module-Device (no spaces), e.g. MailMobileWebclient-iPhone13.
 *
 * Other CLI verbs (install, show-report, …) pass through unchanged.
 *
 * Usage (cwd = modules/CoreMobileWebclient/vue-mobile):
 *   node test/e2e/scripts/playwright-cli.js test
 *   node test/e2e/scripts/playwright-cli.js test --setup "MailMobileWebclient iPhone13"
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

const DEVICES = [
  'iPhoneSE',
  'iPhone13',
  'Pixel7',
  'Pixel7Firefox',
  'iPhoneSEWebKit',
  'iPhone13WebKit',
]

/** Lowercase / spaced aliases → canonical device suffix */
const DEVICE_ALIASES = {
  iphonese: 'iPhoneSE',
  'iphone se': 'iPhoneSE',
  iphone13: 'iPhone13',
  'iphone 13': 'iPhone13',
  pixel7: 'Pixel7',
  'pixel 7': 'Pixel7',
  pixel7firefox: 'Pixel7Firefox',
  'pixel 7 firefox': 'Pixel7Firefox',
  firefox: 'Pixel7Firefox',
  iphonesewebkit: 'iPhoneSEWebKit',
  'iphone se webkit': 'iPhoneSEWebKit',
  iphone13webkit: 'iPhone13WebKit',
  'iphone 13 webkit': 'iPhone13WebKit',
}

function discoverModules() {
  const modulesRoot = path.join(auroraRoot, 'modules')
  if (!fs.existsSync(modulesRoot)) {
    return []
  }

  return fs
    .readdirSync(modulesRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((moduleName) => {
      const testDir = path.join(
        modulesRoot,
        moduleName,
        'vue-mobile',
        'test',
        'e2e'
      )
      if (!fs.existsSync(testDir) || !fs.statSync(testDir).isDirectory()) {
        return false
      }
      return fs.readdirSync(testDir).some((f) => f.endsWith('.spec.js'))
    })
    .sort((a, b) => a.localeCompare(b))
}

function splitCsv(value) {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function normalizeDevice(name) {
  const key = name.trim().toLowerCase()
  if (DEVICE_ALIASES[key]) {
    return DEVICE_ALIASES[key]
  }
  // already canonical?
  const exact = DEVICES.find((d) => d.toLowerCase() === key)
  return exact || name.trim()
}

/**
 * Parse argv: extract --setup / --setup=, return { setup, rest }.
 */
function extractSetup(argv) {
  const rest = []
  let setup = null

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--setup') {
      const next = argv[i + 1]
      if (!next || next.startsWith('-')) {
        throw new Error(
          'Missing value for --setup. Example: --setup "MailMobileWebclient iPhone13"'
        )
      }
      setup = next
      i++
      continue
    }
    if (arg.startsWith('--setup=')) {
      setup = arg.slice('--setup='.length)
      continue
    }
    rest.push(arg)
  }

  return { setup, rest }
}

function parseSetupString(setup) {
  let value = setup.trim()

  // Shorthands when the user forgets the "modules devices" space
  // (common after the old --project=*iPhone13 / Module-iPhone13 days):
  //   *iPhone13              → "* iPhone13"
  //   MailMobileWebclient-iPhone13 → "MailMobileWebclient iPhone13"
  if (!/\s/.test(value)) {
    if (value.startsWith('*') && value.length > 1) {
      value = `* ${value.slice(1)}`
    } else {
      const knownSuffix = [...DEVICES].sort((a, b) => b.length - a.length).find(
        (d) => value.endsWith(`-${d}`) || value.toLowerCase().endsWith(`-${d.toLowerCase()}`)
      )
      if (knownSuffix) {
        const mod = value.slice(0, value.length - knownSuffix.length - 1)
        value = `${mod} ${knownSuffix}`
      } else {
        const asDevice = normalizeDevice(value)
        if (DEVICES.includes(asDevice)) {
          value = `* ${asDevice}`
        }
      }
    }
  }

  const match = value.match(/^(\S+)\s+(.+)$/)
  if (!match) {
    throw new Error(
      `Invalid --setup value: ${JSON.stringify(setup)}\n` +
        'Expected: "<modules> <devices>"\n' +
        'Example: --setup "MailMobileWebclient,ContactsMobileWebclient iPhone13,Pixel7"\n' +
        '         --setup "* iPhone13"   (all modules · iPhone13)\n' +
        'Shorthand also OK: --setup "*iPhone13" or --setup "MailMobileWebclient-iPhone13"'
    )
  }

  const modules = splitCsv(match[1])
  const devices = splitCsv(match[2]).map(normalizeDevice)

  if (modules.length === 0 || devices.length === 0) {
    throw new Error(
      'Both modules and devices are required in --setup "modules devices"'
    )
  }

  return { modules, devices }
}

function expandProjects(modules, devices, knownModules) {
  const resolvedModules = modules.includes('*')
    ? knownModules
    : modules

  if (!modules.includes('*')) {
    const unknownModules = modules.filter((m) => !knownModules.includes(m))
    if (unknownModules.length > 0) {
      throw new Error(
        `Unknown module(s): ${unknownModules.join(', ')}\n` +
          `Available: ${knownModules.join(', ') || '(none discovered)'}\n` +
          'Tip: use * for all modules with e2e specs.'
      )
    }
  }

  const resolvedDevices = devices.includes('*') ? DEVICES : devices

  if (!devices.includes('*')) {
    const unknownDevices = devices.filter((d) => !DEVICES.includes(d))
    if (unknownDevices.length > 0) {
      throw new Error(
        `Unknown device(s): ${unknownDevices.join(', ')}\n` +
          `Available: ${DEVICES.join(', ')}\n` +
          'Aliases: "iPhone 13" → iPhone13, firefox → Pixel7Firefox, …'
      )
    }
  }

  const projects = []
  for (const moduleName of resolvedModules) {
    for (const device of resolvedDevices) {
      projects.push(`${moduleName}-${device}`)
    }
  }
  return projects
}

function buildPlaywrightArgs(argv) {
  // Non-test verbs: pass through (install, show-report, …)
  if (argv[0] !== 'test') {
    return argv
  }

  const { setup, rest } = extractSetup(argv.slice(1))
  const playwrightArgs = ['test']

  if (setup) {
    const knownModules = discoverModules()
    const { modules, devices } = parseSetupString(setup)
    const projects = expandProjects(modules, devices, knownModules)
    console.log(`  → --setup → projects: ${projects.join(' | ')}`)
    for (const name of projects) {
      playwrightArgs.push(`--project=${name}`)
    }
  }

  playwrightArgs.push(...rest)
  return playwrightArgs
}

function main() {
  if (!fs.existsSync(playwrightBin)) {
    console.error(
      `Playwright not found at ${path.join(nodeModules, '@playwright/test')}`
    )
    console.error('From Aurora install root run: npm install')
    process.exit(1)
  }

  let playwrightArgs
  try {
    playwrightArgs = buildPlaywrightArgs(process.argv.slice(2))
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }

  const env = { ...process.env }
  env.NODE_PATH = env.NODE_PATH
    ? `${nodeModules}${path.delimiter}${env.NODE_PATH}`
    : nodeModules

  const result = spawnSync(playwrightBin, playwrightArgs, {
    cwd: vueMobileRoot,
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }

  process.exit(result.status === null ? 1 : result.status)
}

main()
