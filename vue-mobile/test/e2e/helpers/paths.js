const path = require('path')

/**
 * Shared mobile E2E helpers live in CoreMobileWebclient/vue-mobile/test/e2e/helpers.
 * AURORA_MOBILE_E2E_ROOT is set by playwright.config.js (vue-mobile package root).
 */
function sharedHelper(name) {
  const root =
    process.env.AURORA_MOBILE_E2E_ROOT ||
    path.join(__dirname, '..', '..', '..')
  const base = String(name).replace(/\.js$/, '')
  return require(path.join(root, 'test', 'e2e', 'helpers', base))
}

/**
 * Domain helper in modules/<Module>/vue-mobile/test/e2e/helpers/.
 */
function moduleHelper(moduleName, name) {
  const root =
    process.env.AURORA_ROOT ||
    path.join(__dirname, '..', '..', '..', '..', '..', '..')
  const base = String(name).replace(/\.js$/, '')
  return require(
    path.join(
      root,
      'modules',
      moduleName,
      'vue-mobile',
      'test',
      'e2e',
      'helpers',
      base
    )
  )
}

function fixturePath(...parts) {
  const root =
    process.env.AURORA_MOBILE_E2E_ROOT ||
    path.join(__dirname, '..', '..', '..')
  return path.join(root, 'test', 'e2e', 'fixtures', ...parts)
}

module.exports = {
  sharedHelper,
  moduleHelper,
  fixturePath,
}
