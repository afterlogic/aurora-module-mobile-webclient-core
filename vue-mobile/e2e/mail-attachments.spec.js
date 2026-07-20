const path = require('path')
const { test, expect } = require('@playwright/test')
const {
  loginAsTestUser,
  step,
  attachScreenshot,
  fieldControl,
} = require('./helpers/login')
const { clickReady } = require('./helpers/ready')
const {
  FOLDER_TYPES,
  waitForInboxList,
  openFolderByType,
  fillComposeRecipient,
  sendCompose,
} = require('./helpers/mail')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)
const composeTo = process.env.E2E_COMPOSE_TO || process.env.E2E_LOGIN
const fixturePath = path.join(__dirname, 'fixtures', 'e2e-attach.txt')
const fixtureName = 'e2e-attach.txt'

test.describe('Mobile mail attachments', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('composes with attachment, opens it in Sent', async ({ page }) => {
    test.setTimeout(240000)

    const subject = `E2E attach ${Date.now()}`
    const bodyText = `E2E attach body ${Date.now()}`

    await loginAsTestUser(page)
    await waitForInboxList(page)

    await step('Open compose via FAB', async () => {
      await clickReady(page.getByTestId('mail-compose-fab'))
      await expect(page.getByTestId('mail-compose')).toBeVisible({
        timeout: 15000,
      })
    })

    await step(`Fill To: ${composeTo}`, async () => {
      await fillComposeRecipient(page, composeTo)
    })

    await step(`Fill Subject: ${subject}`, async () => {
      await fieldControl(page, 'mail-compose-subject').fill(subject)
    })

    await step(`Attach ${fixtureName}`, async () => {
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.getByTestId('mail-compose-attach').click(),
      ])
      await fileChooser.setFiles(fixturePath)

      const attached = page.getByTestId('mail-compose-attachment-item').filter({
        hasText: fixtureName,
      })
      await expect(attached).toBeVisible({ timeout: 60000 })
      console.log(`  → Attachment uploaded: ${fixtureName}`)
      await attachScreenshot(page, 'mail-attach-01-compose')
    })

    await step('Fill body and send', async () => {
      const editor = page
        .getByTestId('mail-compose-body')
        .locator('.q-editor__content')
      await expect(editor).toBeVisible({ timeout: 15000 })
      await editor.click()
      await editor.fill(bodyText)
      await sendCompose(page)
      await expect(
        page
          .getByTestId('mail-message-list')
          .or(page.getByTestId('mail-message-view'))
      ).toBeVisible({ timeout: 45000 })
      await attachScreenshot(page, 'mail-attach-02-sent')
    })

    await step('Open Sent and find message with attachment', async () => {
      if (await page.getByTestId('mail-message-view').isVisible().catch(() => false)) {
        await clickReady(page.getByTestId('mail-message-back'))
      }
      await openFolderByType(page, FOLDER_TYPES.SENT)

      const item = page
        .getByTestId('mail-message-item')
        .filter({ hasText: subject })
        .first()
      await expect(item).toBeVisible({ timeout: 60000 })
      await clickReady(item)

      await expect(page.getByTestId('mail-message-view')).toBeVisible({
        timeout: 30000,
      })
      await expect(page.getByTestId('mail-message-subject')).toBeVisible({
        timeout: 60000,
      })
      await expect(
        page.getByTestId('mail-message-view').locator('.messages__loader')
      ).toHaveCount(0, { timeout: 30000 })

      const openedSubject = (
        await page.getByTestId('mail-message-subject').innerText()
      ).trim()
      expect(openedSubject).toContain(subject)
      console.log(`  → Opened Sent message: ${openedSubject}`)
    })

    await step('Expect attachment list on message', async () => {
      if (
        (await page.getByTestId('mail-message-flag-attachment').count()) > 0
      ) {
        await clickReady(page.getByTestId('mail-message-flag-attachment'))
      }

      await expect(page.getByTestId('mail-message-attachments')).toBeVisible({
        timeout: 30000,
      })
      const attachment = page
        .getByTestId('mail-attachment-item')
        .filter({ hasText: fixtureName })
        .first()
      await expect(attachment).toBeVisible({ timeout: 15000 })
      console.log(`  → Attachment visible in message: ${fixtureName}`)
      await attachScreenshot(page, 'mail-attach-03-view')
    })
  })
})
