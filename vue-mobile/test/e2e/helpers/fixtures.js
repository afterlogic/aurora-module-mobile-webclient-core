const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { test: base, expect } = require('@playwright/test')

/**
 * Disk cache for /static/vue-mobile/ responses (js/css/images/fonts) so repeat
 * test runs and browser projects don't re-download the same build bundle.
 * Hashed build filenames (e.g. vendor.5b401985.js) make the cache
 * self-invalidating on rebuilds; unhashed assets (favicons) are best-effort.
 */
const CACHE_DIR = path.join(__dirname, '..', '..', '..', '.cache', 'static-route-cache')
const STATIC_MARKER = '/static/vue-mobile/'

function cachedFiles(url) {
  const { pathname, search } = new URL(url)
  const key = crypto.createHash('sha1').update(pathname + search).digest('hex')
  return {
    body: path.join(CACHE_DIR, key),
    meta: path.join(CACHE_DIR, `${key}.json`),
  }
}

function fulfillOptions(status, contentType, body) {
  const opts = { status, body }
  if (contentType) opts.contentType = contentType
  return opts
}

async function serveFromCache(route, files) {
  const meta = JSON.parse(fs.readFileSync(files.meta, 'utf8'))
  await route.fulfill(
    fulfillOptions(meta.status, meta.contentType, fs.readFileSync(files.body))
  )
}

async function fetchAndCache(route, files) {
  const response = await route.fetch()
  const body = await response.body()
  const contentType = response.headers()['content-type'] || ''

  fs.mkdirSync(CACHE_DIR, { recursive: true })
  const tmp = `${files.body}.${process.pid}.tmp`
  fs.writeFileSync(tmp, body)
  fs.renameSync(tmp, files.body)
  fs.writeFileSync(
    files.meta,
    JSON.stringify({ status: response.status(), contentType })
  )

  await route.fulfill(fulfillOptions(response.status(), contentType, body))
}

/** Custom `test` — wraps the built-in `context` fixture to cache static/vue-mobile assets to disk. */
const test = base.extend({
  context: async ({ context }, use) => {
    await context.route(
      (url) => url.pathname.includes(STATIC_MARKER),
      async (route) => {
        const files = cachedFiles(route.request().url())
        if (fs.existsSync(files.body) && fs.existsSync(files.meta)) {
          await serveFromCache(route, files)
          return
        }
        await fetchAndCache(route, files)
      }
    )

    await use(context)
  },
})

module.exports = { test, expect }
