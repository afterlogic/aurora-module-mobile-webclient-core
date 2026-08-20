const { expect } = require('@playwright/test')

/**
 * Wait until a list finished loading: items appeared, or empty-state stayed
 * visible long enough that it is not a pre-fetch flash.
 *
 * Important: while a spinner is visible we must keep polling (return 'pending').
 * Returning 'loading' and asserting `.not.toBe('pending')` exits too early.
 */
async function waitForListReady(
  page,
  {
    itemTestIds,
    emptyTestId,
    spinnerSelectors = [],
    timeout = 60000,
    emptySettleMs = 2000,
  }
) {
  const ids = Array.isArray(itemTestIds) ? itemTestIds : [itemTestIds]
  let emptySince = null

  await expect
    .poll(
      async () => {
        for (const sel of spinnerSelectors) {
          const spinner = page.locator(sel).first()
          if (await spinner.isVisible().catch(() => false)) {
            emptySince = null
            return 'pending'
          }
        }

        let hasItems = false
        for (const id of ids) {
          const loc = page.getByTestId(id)
          const n = await loc.count()
          for (let i = 0; i < n; i++) {
            if (await loc.nth(i).isVisible().catch(() => false)) {
              hasItems = true
              break
            }
          }
          if (hasItems) break
        }

        if (hasItems) {
          emptySince = null
          return 'items'
        }

        const emptyVisible = emptyTestId
          ? await page
              .getByTestId(emptyTestId)
              .isVisible()
              .catch(() => false)
          : false

        if (emptyVisible) {
          if (emptySince == null) {
            emptySince = Date.now()
          }
          if (Date.now() - emptySince >= emptySettleMs) {
            return 'empty'
          }
          return 'pending'
        }

        emptySince = null
        return 'pending'
      },
      { timeout, intervals: [200, 400, 800] }
    )
    .toMatch(/^(items|empty)$/)
}

/** Click only after the locator is visible. */
async function clickReady(locator, options = {}) {
  await expect(locator).toBeVisible({ timeout: options.timeout || 30000 })
  await locator.click(options.clickOptions || {})
}

/**
 * Click an item inside the left drawer (q-scroll-area).
 * Plain clickReady fails: Quasar keeps closed-drawer nodes in the DOM, so
 * Playwright can resolve an item while it is off-screen / not actionable,
 * then retries close the overlay. Scroll the nested container and force-click
 * only after the item is in the viewport.
 */
async function clickDrawerItem(page, item) {
  const drawer = page.getByTestId('mail-drawer')
  await expect(drawer).toBeVisible({ timeout: 15000 })

  await expect
    .poll(
      async () => {
        await item.evaluate((el) => {
          const area = el.closest('.q-scrollarea')
          const container =
            area?.querySelector('.q-scrollarea__container') ||
            el.closest('.q-scrollarea__container') ||
            el.closest('.scroll')
          if (container) {
            const er = el.getBoundingClientRect()
            const cr = container.getBoundingClientRect()
            container.scrollTop +=
              er.top - cr.top - cr.height / 2 + er.height / 2
          } else {
            el.scrollIntoView({ block: 'center', inline: 'nearest' })
          }
        })
        return item.isVisible()
      },
      { timeout: 15000, intervals: [100, 200, 400] }
    )
    .toBeTruthy()

  await expect(item).toBeInViewport({ timeout: 10000 })
  await item.click({ force: true })
}

module.exports = {
  waitForListReady,
  clickReady,
  clickDrawerItem,
}
