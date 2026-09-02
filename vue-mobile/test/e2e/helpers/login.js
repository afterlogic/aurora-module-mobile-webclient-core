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

const TURNSTILE_MODULE = 'CloudflareTurnstileWebclientPlugin'

/**
 * Last `GetAppData` response promise armed for a given page. Lets a bare
 * `waitForTurnstileToken(page)` call still tell whether the Turnstile plugin
 * is active — the desktop helper reads that from the inlined
 * `window.auroraAppData`; mobile never inlines it, so we reuse the response
 * armed for the most recent navigation instead.
 */
const appDataPromiseByPage = new WeakMap()

/** Mirrors next/src/commons/utils/parseApiResponse.ts (tolerates a non-JSON prefix). */
function parseApiResponseText(text) {
  const trimmed = text.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start === -1 || end === -1 || end <= start) {
      return null
    }
    try {
      return JSON.parse(trimmed.slice(start, end + 1))
    } catch {
      return null
    }
  }
}

/**
 * Arm a listener for the bootstrap `Core/GetAppData` response *before*
 * navigating. src/core.js fires this request immediately on app mount
 * (requestAppData()) — arming after goto() can miss it.
 * Resolves to null on timeout.
 */
function armAppDataResponse(page) {
  const promise = page
    .waitForResponse(
      (res) =>
        res.request().method() === 'POST' &&
        (res.request().postData() || '').includes('Method=GetAppData'),
      { timeout: 20000 }
    )
    .then((res) => res.text())
    .then(parseApiResponseText)
    .catch(() => null)
  // Remember it so a later bare waitForTurnstileToken(page) can reuse it.
  appDataPromiseByPage.set(page, promise)
  return promise
}

/**
 * Turnstile is in play only when the plugin is both available *and* switched
 * on in its own config: ShowTurnstile === true with a non-empty SiteKey
 * (mirrors next/src/features/login/utils/captchaTokens.ts isTurnstileRequired).
 * `appData` is the unwrapped payload (the `Result` object of GetAppData).
 */
function isTurnstileEnabledIn(appData) {
  const modules = appData?.Core?.AvailableClientModules
  if (!Array.isArray(modules) || !modules.includes(TURNSTILE_MODULE)) {
    return false
  }
  const config = appData?.[TURNSTILE_MODULE]
  return (
    config?.ShowTurnstile === true &&
    typeof config?.SiteKey === 'string' &&
    config.SiteKey !== ''
  )
}

/**
 * Mobile never inlines app data — read it from the GetAppData API response.
 * Falls back to the response armed for this page's most recent navigation
 * (see armAppDataResponse) so callers that pass nothing still get a real
 * answer; when nothing was armed we cannot tell, so report "inactive" and
 * skip the wait — same as the desktop helper does without window.auroraAppData.
 */
async function isTurnstileModuleActive(page, appDataResponsePromise) {
  const source = appDataResponsePromise || appDataPromiseByPage.get(page) || null
  const appData = source ? await source : null
  return isTurnstileEnabledIn(appData?.Result)
}

/**
 * Wait for a Cloudflare Turnstile token, but only when the backend reports
 * the plugin as active — otherwise the widget will never load and there is
 * nothing to wait for.
 * Script loads async — first detect widget/API, then wait for token.
 */
async function waitForTurnstileToken(page, appDataResponsePromise) {
  if (!(await isTurnstileModuleActive(page, appDataResponsePromise))) {
    return
  }

  // Give the Turnstile script a short window to appear.
  const appeared = await page
    .waitForFunction(
      () => {
        if (typeof window.turnstile !== 'undefined') return true
        return !!document.querySelector(
          '.cf-turnstile, .turnstile-place-cover, iframe[src*="challenges.cloudflare.com"]'
        )
      },
      undefined,
      { timeout: 8000 }
    )
    .then(() => true)
    .catch(() => false)

  if (!appeared) {
    return
  }

  await page.waitForFunction(
    () => {
      try {
        return !!(window.turnstile && window.turnstile.getResponse())
      } catch (e) {
        return false
      }
    },
    undefined,
    { timeout: 45000 }
  )
}

/**
 * Standard form uses login-email; MailLoginForm uses login-username (+ optional domain).
 */
async function resolveLoginFieldTestId(page) {
  const username = page.getByTestId('login-username')
  if (await username.isVisible().catch(() => false)) {
    return 'login-username'
  }
  return 'login-email'
}

/**
 * For MailLoginFormMobileWebclient: fill local-part and pick domain from a full email.
 * For Standard form: fill the email as-is.
 */
async function fillLoginCredentials(page, loginFieldTestId, login) {
  if (loginFieldTestId !== 'login-username') {
    await fieldControl(page, loginFieldTestId).fill(login)
    return
  }

  let localPart = login
  let emailDomain = ''
  const atIndex = login.lastIndexOf('@')
  if (atIndex > 0) {
    localPart = login.slice(0, atIndex)
    emailDomain = login.slice(atIndex + 1)
  }

  await fieldControl(page, 'login-username').fill(localPart)

  const domainSelect = page.getByTestId('login-domain')
  if (emailDomain && (await domainSelect.isVisible().catch(() => false))) {
    await domainSelect.click()
    const option = page.getByRole('option', { name: emailDomain, exact: true })
    if (await option.isVisible().catch(() => false)) {
      await option.click()
    } else {
      // Quasar may render options as list items without role=option in some themes.
      const item = page.locator('.q-menu .q-item', { hasText: emailDomain }).first()
      if (await item.isVisible().catch(() => false)) {
        await item.click()
      }
    }
  }
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

  // Must be armed before the first goto() — core.js fires GetAppData
  // immediately on bootstrap, so listening starts before it can fire.
  const appDataResponsePromise = armAppDataResponse(page)
  let loginFieldTestId = 'login-email'

  await step('Open mobile login page (clean session)', async () => {
    // Fresh BrowserContext per test already isolates storage; cookies alone
    // cover PHP session. Avoid page.evaluate() here — ?mobile-version redirects
    // race and destroy the execution context.
    await page.context().clearCookies()
    // '' = baseURL as-is. '/' drops /aurora-dev/?mobile-version and hits host root.
    await page.goto('', { waitUntil: 'domcontentloaded' })
    await page
      .locator('[data-test-id="login-email"], [data-test-id="login-username"]')
      .first()
      .waitFor({
        state: 'visible',
        timeout: 30000,
      })
    loginFieldTestId = await resolveLoginFieldTestId(page)
    await attachScreenshot(page, 'login-form')
  })

  await step('Wait for Turnstile token (if present)', async () => {
    await waitForTurnstileToken(page, appDataResponsePromise)
  })

  await step(`Fill credentials (${login})`, async () => {
    await fillLoginCredentials(page, loginFieldTestId, login)
    await fieldControl(page, 'login-password').fill(password)
    // Token can expire while typing on slow runs — refresh wait before submit.
    await waitForTurnstileToken(page, appDataResponsePromise)
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
    await expect(page.getByTestId(loginFieldTestId)).not.toBeVisible({
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
  armAppDataResponse,
  waitForTurnstileToken,
  resolveLoginFieldTestId,
  fillLoginCredentials,
  loginAsUser,
  loginAsTestUser,
}
