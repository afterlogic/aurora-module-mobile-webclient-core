const { test, expect } = require('@playwright/test')
const {
  loginAsTestUser,
  step,
  attachScreenshot,
} = require('./helpers/login')
const { clickReady } = require('./helpers/ready')
const {
  openFirstInboxMessage,
  expectComposeOpen,
  readComposeSubject,
  closeComposeWithoutSending,
} = require('./helpers/mail')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)

test.describe('Mobile mail message actions', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('toggles details and star on opened message', async ({ page }) => {
    test.setTimeout(120000)
    await loginAsTestUser(page)

    const opened = await openFirstInboxMessage(page)
    test.skip(!opened, 'Inbox is empty — need at least one message')

    await step('Expect message chrome (sender, actions, more)', async () => {
      await expect(page.getByTestId('mail-message-sender')).toBeVisible()
      await expect(page.getByTestId('mail-action-reply')).toBeVisible()
      await expect(page.getByTestId('mail-action-delete')).toBeVisible()
      await expect(page.getByTestId('mail-message-more')).toBeVisible()
      await expect(page.getByTestId('mail-message-star')).toBeVisible()
      await attachScreenshot(page, 'mail-actions-01-view')
    })

    await step('Toggle message details', async () => {
      await expect(page.getByTestId('mail-message-details')).toBeHidden()
      await clickReady(page.getByTestId('mail-message-toggle-details'))
      await expect(page.getByTestId('mail-message-details')).toBeVisible({
        timeout: 10000,
      })
      console.log('  → Details expanded')
      await clickReady(page.getByTestId('mail-message-toggle-details'))
      await expect(page.getByTestId('mail-message-details')).toBeHidden({
        timeout: 10000,
      })
      console.log('  → Details collapsed')
    })

    await step('Toggle star flag', async () => {
      const wasOn = (await page.getByTestId('mail-message-star-on').count()) > 0
      await clickReady(page.getByTestId('mail-message-star'))
      if (wasOn) {
        await expect(page.getByTestId('mail-message-star-off')).toBeVisible({
          timeout: 15000,
        })
        console.log('  → Star turned off')
      } else {
        await expect(page.getByTestId('mail-message-star-on')).toBeVisible({
          timeout: 15000,
        })
        console.log('  → Star turned on')
      }
      // Restore previous state so the mailbox stays predictable.
      await clickReady(page.getByTestId('mail-message-star'))
      if (wasOn) {
        await expect(page.getByTestId('mail-message-star-on')).toBeVisible({
          timeout: 15000,
        })
      } else {
        await expect(page.getByTestId('mail-message-star-off')).toBeVisible({
          timeout: 15000,
        })
      }
      await attachScreenshot(page, 'mail-actions-02-star')
    })
  })

  test('reply opens compose with Re: subject and recipient', async ({
    page,
  }) => {
    test.setTimeout(120000)
    await loginAsTestUser(page)

    const opened = await openFirstInboxMessage(page)
    test.skip(!opened, 'Inbox is empty — need at least one message')

    await step('Tap Reply in toolbar', async () => {
      await clickReady(page.getByTestId('mail-action-reply'))
      await expectComposeOpen(page)
      await attachScreenshot(page, 'mail-reply-01-compose')
    })

    await step('Expect Re: subject and To chip', async () => {
      const subject = await readComposeSubject(page)
      console.log(`  → Reply subject: ${subject}`)
      // English: "Re: …"; other locales still use "PREFIX: …"
      expect(subject).toMatch(/^[^:]+:\s*/)
      expect(subject.toLowerCase()).toMatch(/^re:/)
      await expect(
        page.getByTestId('mail-compose-to').locator('.recipients-input__chip')
      ).toBeVisible({ timeout: 15000 })
    })

    await closeComposeWithoutSending(page)
    await expect(page.getByTestId('mail-message-view')).toBeVisible({
      timeout: 30000,
    })
  })

  test('reply-all from overflow menu opens compose', async ({ page }) => {
    test.setTimeout(120000)
    await loginAsTestUser(page)

    const opened = await openFirstInboxMessage(page)
    test.skip(!opened, 'Inbox is empty — need at least one message')

    await step('Open overflow menu → Reply all', async () => {
      await clickReady(page.getByTestId('mail-message-more'))
      await expect(page.getByTestId('mail-menu-replyAll')).toBeVisible({
        timeout: 10000,
      })
      await clickReady(page.getByTestId('mail-menu-replyAll'))
      await expectComposeOpen(page)
      await attachScreenshot(page, 'mail-reply-all-01-compose')
    })

    await step('Expect Re: subject', async () => {
      const subject = await readComposeSubject(page)
      console.log(`  → Reply-all subject: ${subject}`)
      expect(subject.toLowerCase().startsWith('re:')).toBeTruthy()
    })

    await closeComposeWithoutSending(page)
  })

  test('forward from overflow menu opens compose with Fwd:', async ({
    page,
  }) => {
    test.setTimeout(120000)
    await loginAsTestUser(page)

    const opened = await openFirstInboxMessage(page)
    test.skip(!opened, 'Inbox is empty — need at least one message')

    await step('Open overflow menu → Forward', async () => {
      await clickReady(page.getByTestId('mail-message-more'))
      await expect(page.getByTestId('mail-menu-forward')).toBeVisible({
        timeout: 10000,
      })
      await clickReady(page.getByTestId('mail-menu-forward'))
      await expectComposeOpen(page)
      await attachScreenshot(page, 'mail-forward-01-compose')
    })

    await step('Expect Fwd: subject', async () => {
      const subject = await readComposeSubject(page)
      console.log(`  → Forward subject: ${subject}`)
      expect(subject.toLowerCase().startsWith('fwd:')).toBeTruthy()
    })

    await closeComposeWithoutSending(page)
  })

  test('search header opens and closes', async ({ page }) => {
    test.setTimeout(90000)
    await loginAsTestUser(page)

    await step('Open search from mail header', async () => {
      await expect(page.getByTestId('mail-search')).toBeVisible({
        timeout: 30000,
      })
      await clickReady(page.getByTestId('mail-search'))
      await expect(page.getByTestId('mail-search-input')).toBeVisible({
        timeout: 15000,
      })
      await expect(page.getByTestId('mail-search-advanced')).toBeVisible()
      await attachScreenshot(page, 'mail-search-01-open')
    })

    await step('Close search', async () => {
      await clickReady(page.getByTestId('mail-search-close'))
      await expect(page.getByTestId('mail-search-input')).toBeHidden({
        timeout: 15000,
      })
      await expect(page.getByTestId('mail-search')).toBeVisible()
    })
  })
})
