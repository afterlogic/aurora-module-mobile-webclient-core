const { test, expect } = require('@playwright/test')
const { loginAsTestUser, step, attachScreenshot } = require('./helpers/login')
const { waitForListReady, clickReady } = require('./helpers/ready')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)

test.describe('Mobile mail', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('opens first message from inbox and goes back', async ({ page }) => {
    test.setTimeout(120000)

    await loginAsTestUser(page)

    await step('Wait for mail message list', async () => {
      await expect(page.getByTestId('mail-message-list')).toBeVisible({
        timeout: 60000,
      })
      console.log('  → mail-message-list is visible')
    })

    await step('Wait until inbox finished loading (items or empty)', async () => {
      await waitForListReady(page, {
        itemTestIds: 'mail-message-item',
        emptyTestId: 'mail-empty-folder',
        spinnerSelectors: [
          '.messages__loader_initial',
          '.messages__loader_initial .q-spinner-dots',
        ],
        timeout: 60000,
      })
    })

    const messageItems = page.getByTestId('mail-message-item')
    const count = await messageItems.count()

    await step(`Inspect inbox (found ${count} message(s))`, async () => {
      if (count === 0) {
        console.log('  → Inbox is empty (mail-empty-folder)')
        await attachScreenshot(page, 'mail-inbox-empty')
        return
      }

      const first = messageItems.first()
      const from = (
        await first.locator('.message__name').innerText().catch(() => '')
      ).trim()
      const subject = (
        await first.locator('.message__subject').innerText().catch(() => '')
      ).trim()
      const date = (
        await first.locator('.message__date').innerText().catch(() => '')
      ).trim()

      console.log(`  → First message from: ${from || '(unknown)'}`)
      console.log(`  → First message subject: ${subject || '(empty subject)'}`)
      console.log(`  → First message date: ${date || '(unknown)'}`)
      await attachScreenshot(page, 'mail-inbox-list')
    })

    test.skip(count === 0, 'Inbox is empty — put at least one message in the test mailbox for C2')

    await step('Open first message in the list', async () => {
      await clickReady(messageItems.first())
      console.log('  → Clicked first mail-message-item')
    })

    await step('Wait for message view shell', async () => {
      await expect(page.getByTestId('mail-message-view')).toBeVisible({
        timeout: 30000,
      })
      console.log('  → mail-message-view is visible (may still be loading body)')
      await attachScreenshot(page, 'mail-message-loading-or-open')
    })

    await step('Wait for message subject (IMAP fetch done)', async () => {
      await expect(page.getByTestId('mail-message-subject')).toBeVisible({
        timeout: 60000,
      })
      await expect(
        page.getByTestId('mail-message-view').locator('.messages__loader')
      ).toHaveCount(0, { timeout: 30000 })
      const subject = (
        await page.getByTestId('mail-message-subject').innerText()
      ).trim()
      console.log(`  → Opened message subject: ${subject || '(empty subject)'}`)
      await attachScreenshot(page, 'mail-message-opened')
    })

    await step('Go back to inbox list', async () => {
      await clickReady(page.getByTestId('mail-message-back'))
      await expect(page.getByTestId('mail-message-view')).not.toBeVisible({
        timeout: 15000,
      })
      await expect(page.getByTestId('mail-message-list')).toBeVisible({
        timeout: 30000,
      })
      await waitForListReady(page, {
        itemTestIds: 'mail-message-item',
        emptyTestId: 'mail-empty-folder',
        spinnerSelectors: ['.messages__loader_initial'],
        timeout: 60000,
      })
      await expect(page.getByTestId('mail-message-item').first()).toBeVisible({
        timeout: 15000,
      })
      console.log('  → Back on inbox list with messages')
      await attachScreenshot(page, 'mail-back-to-inbox')
    })
  })
})
