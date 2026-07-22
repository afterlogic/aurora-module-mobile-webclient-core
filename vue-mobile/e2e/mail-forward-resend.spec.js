const { test, expect } = require('@playwright/test')
const { loginAsTestUser, step, attachScreenshot } = require('./helpers/login')
const {
  openFirstInboxMessage,
  expectComposeOpen,
  closeComposeWithoutSending,
  readComposeSubject,
} = require('./helpers/mail')
const { clickReady } = require('./helpers/ready')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)

test.describe('Mobile mail forward as attachment', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('opens compose via Forward as Attachment', async ({ page }) => {
    test.setTimeout(180000)
    await loginAsTestUser(page)

    const opened = await openFirstInboxMessage(page)
    test.skip(!opened, 'Inbox is empty')

    await step('Overflow → Forward as Attachment', async () => {
      await clickReady(page.getByTestId('mail-message-more'))
      const action = page.getByTestId('mail-menu-forwardAsAttachment')
      test.skip(
        (await action.count()) === 0,
        'Forward as Attachment not available'
      )
      await clickReady(action)
      await expectComposeOpen(page)
      const subject = await readComposeSubject(page)
      console.log(`  → Compose subject: ${subject}`)
      // Attachment of original message should appear in uploader list when present.
      const attachItem = page.getByTestId('mail-compose-attachment-item')
      if ((await attachItem.count()) > 0) {
        await expect(attachItem.first()).toBeVisible({ timeout: 15000 })
        console.log('  → Forwarded message attached')
      } else {
        console.log('  → No attachment chip yet (UI may embed differently)')
      }
      await attachScreenshot(page, 'mail-fwd-attach-01')
    })

    await closeComposeWithoutSending(page)
  })

  test('opens compose via Resend when available', async ({ page }) => {
    test.setTimeout(180000)
    await loginAsTestUser(page)

    const opened = await openFirstInboxMessage(page)
    test.skip(!opened, 'Inbox is empty')

    await step('Overflow → Resend', async () => {
      await clickReady(page.getByTestId('mail-message-more'))
      const action = page.getByTestId('mail-menu-resend')
      test.skip((await action.count()) === 0, 'Resend not available on this message')
      await clickReady(action)
      await expectComposeOpen(page)
      const subject = await readComposeSubject(page)
      console.log(`  → Resend compose subject: ${subject}`)
      await attachScreenshot(page, 'mail-resend-01')
    })

    await closeComposeWithoutSending(page)
  })
})
