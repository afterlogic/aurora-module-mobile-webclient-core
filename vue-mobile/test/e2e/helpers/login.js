const { test, expect } = require('@playwright/test')

/** Named step: shows in console + HTML report. */
async function step(title, fn) {
  console.log(`  → ${title}`)
  return test.step(title, fn)
}

/** Attach a PNG to the HTML report (visible under the test / step). */
async function attachScreenshot(page, name) {
  const body = await page.screenshot({ fullPage: true })
  await test.info().attach(name, { body, contentType: 'image/png' })
  console.log(`  → screenshot: ${name}`)
}

function fieldControl(page, testId) {
  return page.locator(
    `[data-test-id="${testId}"] input, input[data-test-id="${testId}"], textarea[data-test-id="${testId}"]`
  )
}

async function waitForTurnstileToken(page) {
  await page.waitForFunction(
    () => {
      try {
        return !!(window.turnstile && window.turnstile.getResponse())
      } catch (e) {
        return false
      }
    },
    { timeout: 45000 }
  )
}

/**
 * Fresh anonymous session, then login.
 * @param {{ login?: string, password?: string }} [credentials]
 *   Defaults to E2E_LOGIN / E2E_PASSWORD. Pass overrides for multi-user flows
 *   (e.g. E2E_LOGIN_SECONDARY).
 * Leaves the app on the post-login shell with footer nav visible.
 */
async function loginAsUser(page, credentials = {}) {
  const login = credentials.login || process.env.E2E_LOGIN
  const password = credentials.password || process.env.E2E_PASSWORD
  if (!login || !password) {
    throw new Error('Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')
  }

  await step('Open mobile login page (clean session)', async () => {
    // Fresh BrowserContext per test already isolates storage; cookies alone
    // cover PHP session. Avoid page.evaluate() here — ?mobile-version redirects
    // race and destroy the execution context.
    await page.context().clearCookies()
    // '' = baseURL as-is. '/' drops /aurora-dev/?mobile-version and hits host root.
    await page.goto('', { waitUntil: 'domcontentloaded' })
    await page.getByTestId('login-email').waitFor({
      state: 'visible',
      timeout: 30000,
    })
    await attachScreenshot(page, 'login-form')
  })

  await step('Wait for Cloudflare Turnstile token', async () => {
    await waitForTurnstileToken(page)
  })

  await step(`Fill credentials (${login})`, async () => {
    await fieldControl(page, 'login-email').fill(login)
    await fieldControl(page, 'login-password').fill(password)
    // Token can expire while typing on slow runs — refresh wait before submit.
    await waitForTurnstileToken(page)
  })

  await step('Submit login form', async () => {
    await expect(page.getByTestId('login-submit')).toBeEnabled({
      timeout: 10000,
    })
    await page.getByTestId('login-submit').click()
  })

  await step('Wait for app shell after login', async () => {
    await page.getByTestId('app-shell').waitFor({
      state: 'visible',
      timeout: 45000,
    })
    await expect(page.getByTestId('login-email')).not.toBeVisible({
      timeout: 15000,
    })
    // Footer nav is a stronger "fully booted" signal than app-shell alone.
    await expect(page.getByTestId('nav-mail')).toBeVisible({
      timeout: 30000,
    })
    await attachScreenshot(page, 'after-login-shell')
  })
}

/** Login with E2E_LOGIN / E2E_PASSWORD. */
async function loginAsTestUser(page) {
  return loginAsUser(page)
}

module.exports = {
  step,
  attachScreenshot,
  fieldControl,
  waitForTurnstileToken,
  loginAsUser,
  loginAsTestUser,
}
