const { test, expect } = require('@playwright/test')
const {
  loginAsTestUser,
  step,
  attachScreenshot,
  fieldControl,
} = require('./helpers/login')
const { waitForListReady, clickReady } = require('./helpers/ready')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)
const composeTo = process.env.E2E_COMPOSE_TO || process.env.E2E_LOGIN

test.describe('Mobile mail compose', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('composes and sends a message', async ({ page }) => {
    test.setTimeout(180000)

    const subject = `E2E compose ${Date.now()}`
    const bodyText = `E2E compose body ${Date.now()}`

    await loginAsTestUser(page)

    await step('Wait for inbox list (compose FAB appears here)', async () => {
      await expect(page.getByTestId('mail-message-list')).toBeVisible({
        timeout: 60000,
      })
      await waitForListReady(page, {
        itemTestIds: 'mail-message-item',
        emptyTestId: 'mail-empty-folder',
        spinnerSelectors: ['.messages__loader_initial'],
        timeout: 60000,
      })
      await expect(page.getByTestId('mail-compose-fab')).toBeVisible({
        timeout: 15000,
      })
      await attachScreenshot(page, 'compose-01-inbox')
    })

    await step('Open compose via FAB', async () => {
      await clickReady(page.getByTestId('mail-compose-fab'))
      await expect(page.getByTestId('mail-compose')).toBeVisible({
        timeout: 15000,
      })
      console.log('  → Compose form is open')
      await attachScreenshot(page, 'compose-02-form-open')
    })

    await step(`Fill To: ${composeTo}`, async () => {
      const toField = page.getByTestId('mail-compose-to')
      await toField.locator('.q-field__control, .q-field__native').first().click()
      const toInput = toField.locator('input').first()
      await toInput.fill(composeTo, { force: true })

      // RecipientsInput filter debounce is 100ms; wait for suggestion(s).
      const option = page.getByRole('option', { name: composeTo }).first()
      await expect(option).toBeVisible({ timeout: 15000 })
      await option.click()

      await expect(toField.locator('.recipients-input__chip')).toBeVisible({
        timeout: 15000,
      })
      // Dialog/menu should close after selection (iOS Quasar behavior).
      await expect(page.getByRole('dialog')).toBeHidden({ timeout: 10000 }).catch(
        () => undefined
      )
      console.log('  → Recipient chip added')
    })

    await step(`Fill Subject: ${subject}`, async () => {
      await fieldControl(page, 'mail-compose-subject').fill(subject)
    })

    await step('Fill message body', async () => {
      const editor = page
        .getByTestId('mail-compose-body')
        .locator('.q-editor__content')
      await expect(editor).toBeVisible({ timeout: 15000 })
      await editor.click()
      // fill is more stable than keyboard.type for contenteditable.
      await editor.fill(bodyText)
      console.log(`  → Body typed (${bodyText.length} chars)`)
      await attachScreenshot(page, 'compose-03-filled')
    })

    await step('Send message', async () => {
      await clickReady(page.getByTestId('mail-compose-send'))
      console.log('  → Send clicked')
    })

    await step('Return to inbox after send', async () => {
      await expect(page.getByTestId('mail-compose')).toBeHidden({
        timeout: 60000,
      })
      await expect(page.getByTestId('mail-message-list')).toBeVisible({
        timeout: 30000,
      })
      console.log('  → Back on message list after send')
      await attachScreenshot(page, 'compose-04-after-send')
    })
  })
})
