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
  expectComposeOpen,
  readComposeSubject,
  openFolderByType,
  fillComposeRecipient,
  sendCompose,
} = require('./helpers/mail')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)
const composeTo = process.env.E2E_COMPOSE_TO || process.env.E2E_LOGIN

async function openCompose(page) {
  await waitForInboxList(page)
  await clickReady(page.getByTestId('mail-compose-fab'))
  await expectComposeOpen(page)
}

async function saveDraftFromMenu(page) {
  await clickReady(page.getByTestId('mail-compose-more'))
  await expect(page.getByTestId('mail-compose-save')).toBeVisible({
    timeout: 10000,
  })
  await clickReady(page.getByTestId('mail-compose-save'))
}

test.describe('Mobile mail compose draft', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('saves draft and reopens it from Drafts', async ({ page }) => {
    test.setTimeout(240000)

    const subject = `E2E draft ${Date.now()}`
    const bodyText = `E2E draft body ${Date.now()}`

    await loginAsTestUser(page)
    await openCompose(page)

    await step(`Fill draft To / Subject / Body`, async () => {
      await fillComposeRecipient(page, composeTo)
      await fieldControl(page, 'mail-compose-subject').fill(subject)
      const editor = page
        .getByTestId('mail-compose-body')
        .locator('.q-editor__content')
      await expect(editor).toBeVisible({ timeout: 15000 })
      await editor.click()
      await editor.fill(bodyText)
      await attachScreenshot(page, 'mail-draft-01-filled')
    })

    await step('Save draft via overflow menu', async () => {
      await saveDraftFromMenu(page)
      // Stay on compose after manual save; wait for UI to settle.
      await expect(page.getByTestId('mail-compose')).toBeVisible({
        timeout: 15000,
      })
      // REPORT_MESSAGE_SAVED — English or Russian locale.
      await expect(page.getByText(/saved|сохран/i).first()).toBeVisible({
        timeout: 30000,
      })
      console.log(`  → Draft saved: ${subject}`)
      await attachScreenshot(page, 'mail-draft-02-saved')
    })

    await step('Leave compose after save', async () => {
      await clickReady(page.getByTestId('mail-compose-back'))
      // If discard dialog appears (dirty editor vs snapshot), confirm leave.
      const discard = page.getByTestId('mail-compose-discard-dialog')
      if (await discard.isVisible().catch(() => false)) {
        await clickReady(page.getByTestId('mail-compose-discard-ok'))
      }
      await expect(page.getByTestId('mail-compose')).toBeHidden({
        timeout: 30000,
      })
    })

    await step('Open Drafts and find saved draft', async () => {
      await openFolderByType(page, FOLDER_TYPES.DRAFTS)
      const item = page
        .getByTestId('mail-message-item')
        .filter({ hasText: subject })
        .first()
      await expect(item).toBeVisible({ timeout: 60000 })
      await clickReady(item)
      await expectComposeOpen(page)
      // Draft open fetches GetMessage (not cached like reply-from-view).
      await expect(fieldControl(page, 'mail-compose-subject')).toHaveValue(
        subject,
        { timeout: 60000 }
      )
      const openedSubject = await readComposeSubject(page)
      console.log(`  → Reopened draft subject: ${openedSubject}`)
      await expect(
        page.getByTestId('mail-compose-to').locator('.recipients-input__chip')
      ).toBeVisible({ timeout: 15000 })
      await attachScreenshot(page, 'mail-draft-03-reopened')
    })
  })

  test('sends opened draft and finds it in Sent', async ({ page }) => {
    test.setTimeout(240000)

    const subject = `E2E draft send ${Date.now()}`
    const bodyText = `E2E draft send body ${Date.now()}`

    await loginAsTestUser(page)
    await openCompose(page)

    await step('Fill and save draft', async () => {
      await fillComposeRecipient(page, composeTo)
      await fieldControl(page, 'mail-compose-subject').fill(subject)
      const editor = page
        .getByTestId('mail-compose-body')
        .locator('.q-editor__content')
      await expect(editor).toBeVisible({ timeout: 15000 })
      await editor.click()
      await editor.fill(bodyText)
      await saveDraftFromMenu(page)
      await expect(page.getByText(/saved|сохран/i).first()).toBeVisible({
        timeout: 30000,
      })
      console.log(`  → Draft saved: ${subject}`)
    })

    await step('Leave compose', async () => {
      await clickReady(page.getByTestId('mail-compose-back'))
      const discard = page.getByTestId('mail-compose-discard-dialog')
      if (await discard.isVisible().catch(() => false)) {
        await clickReady(page.getByTestId('mail-compose-discard-ok'))
      }
      await expect(page.getByTestId('mail-compose')).toBeHidden({
        timeout: 30000,
      })
    })

    await step('Open draft from Drafts and send', async () => {
      await openFolderByType(page, FOLDER_TYPES.DRAFTS)
      const item = page
        .getByTestId('mail-message-item')
        .filter({ hasText: subject })
        .first()
      await expect(item).toBeVisible({ timeout: 60000 })
      await clickReady(item)
      await expectComposeOpen(page)
      await expect(fieldControl(page, 'mail-compose-subject')).toHaveValue(
        subject,
        { timeout: 60000 }
      )
      await sendCompose(page)
      await expect(
        page
          .getByTestId('mail-message-list')
          .or(page.getByTestId('mail-message-view'))
      ).toBeVisible({ timeout: 60000 })
      console.log(`  → Draft sent: ${subject}`)
      await attachScreenshot(page, 'mail-draft-send-01-after-send')
    })

    await step('Find sent message in Sent', async () => {
      if (
        await page.getByTestId('mail-message-view').isVisible().catch(() => false)
      ) {
        await clickReady(page.getByTestId('mail-message-back'))
      }
      await openFolderByType(page, FOLDER_TYPES.SENT)
      const sentItem = page
        .getByTestId('mail-message-item')
        .filter({ hasText: subject })
        .first()
      await expect(sentItem).toBeVisible({ timeout: 60000 })
      console.log(`  → Found in Sent: ${subject}`)
      await attachScreenshot(page, 'mail-draft-send-02-sent')
    })
  })

  test('asks to discard unsaved changes on back', async ({ page }) => {
    test.setTimeout(120000)

    await loginAsTestUser(page)
    await openCompose(page)

    await step('Type subject without saving', async () => {
      await fieldControl(page, 'mail-compose-subject').fill(
        `E2E discard ${Date.now()}`
      )
    })

    await step('Back → discard dialog → Cancel stays on compose', async () => {
      await clickReady(page.getByTestId('mail-compose-back'))
      await expect(page.getByTestId('mail-compose-discard-dialog')).toBeVisible(
        { timeout: 15000 }
      )
      await clickReady(page.getByTestId('mail-compose-discard-cancel'))
      await expect(page.getByTestId('mail-compose-discard-dialog')).toBeHidden({
        timeout: 15000,
      })
      await expect(page.getByTestId('mail-compose')).toBeVisible()
      await attachScreenshot(page, 'mail-draft-discard-01-cancel')
    })

    await step('Back → discard dialog → OK leaves compose', async () => {
      await clickReady(page.getByTestId('mail-compose-back'))
      await expect(page.getByTestId('mail-compose-discard-dialog')).toBeVisible(
        { timeout: 15000 }
      )
      await clickReady(page.getByTestId('mail-compose-discard-ok'))
      await expect(page.getByTestId('mail-compose')).toBeHidden({
        timeout: 30000,
      })
      await expect(page.getByTestId('mail-message-list')).toBeVisible({
        timeout: 30000,
      })
      await attachScreenshot(page, 'mail-draft-discard-02-ok')
    })
  })
})
