const { test, expect } = require('@playwright/test')
const {
  loginAsTestUser,
  step,
  attachScreenshot,
} = require('./helpers/login')
const { clickReady } = require('./helpers/ready')
const {
  FOLDER_TYPES,
  openFirstInboxMessage,
  expectComposeOpen,
  readComposeSubject,
  openFolderByType,
  fillComposeRecipient,
  sendCompose,
  waitForInboxList,
} = require('./helpers/mail')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)
const composeTo = process.env.E2E_COMPOSE_TO || process.env.E2E_LOGIN

test.describe('Mobile mail mutations', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('views message headers from overflow menu', async ({ page }) => {
    test.setTimeout(120000)
    await loginAsTestUser(page)
    const opened = await openFirstInboxMessage(page)
    test.skip(!opened, 'Inbox is empty')

    await step('Open headers dialog', async () => {
      await clickReady(page.getByTestId('mail-message-more'))
      await clickReady(page.getByTestId('mail-menu-viewHeaders'))
      await expect(page.getByTestId('mail-headers-dialog')).toBeVisible({
        timeout: 15000,
      })
      await expect(page.getByTestId('mail-headers-content')).toBeVisible()
      const text = (
        await page.getByTestId('mail-headers-content').innerText()
      ).trim()
      console.log(`  → Headers length: ${text.length}`)
      expect(text.length).toBeGreaterThan(0)
      await attachScreenshot(page, 'mail-headers-01')
    })

    await step('Close headers dialog', async () => {
      await page.locator('[data-test-id="mail-headers-dialog"] .cancel-icon').click()
      await expect(page.getByTestId('mail-headers-dialog')).toBeHidden({
        timeout: 15000,
      })
    })
  })

  test('moves message via Move dialog to Trash', async ({ page }) => {
    test.setTimeout(180000)
    await loginAsTestUser(page)
    const opened = await openFirstInboxMessage(page)
    test.skip(!opened, 'Inbox is empty')

    const subject = opened.viewSubject

    await step('Move via overflow menu to Trash', async () => {
      await clickReady(page.getByTestId('mail-message-more'))
      await clickReady(page.getByTestId('mail-menu-moveToFolder'))
      await expect(page.getByTestId('mail-move-dialog')).toBeVisible({
        timeout: 15000,
      })
      const trash = page
        .locator(
          `[data-test-id="mail-move-folder-item"][data-folder-type="${FOLDER_TYPES.TRASH}"]`
        )
        .first()
      await expect(trash).toBeVisible({ timeout: 15000 })
      const destName = (await trash.innerText().catch(() => '')).trim()
      console.log(`  → Moving "${subject}" → ${destName || 'Trash'}`)
      await clickReady(trash)
      await expect(page.getByTestId('mail-move-dialog')).toBeHidden({
        timeout: 45000,
      })
      await expect(page.getByTestId('mail-message-list')).toBeVisible({
        timeout: 30000,
      })
      await attachScreenshot(page, 'mail-move-01-after')
    })

    await step('Open Trash to confirm destination', async () => {
      await openFolderByType(page, FOLDER_TYPES.TRASH)
      await attachScreenshot(page, 'mail-move-02-trash')
    })
  })

  test('marks message as spam and opens Spam folder', async ({ page }) => {
    test.setTimeout(180000)
    await loginAsTestUser(page)
    const opened = await openFirstInboxMessage(page)
    test.skip(!opened, 'Inbox is empty')

    await step('Overflow → Mark as spam', async () => {
      await clickReady(page.getByTestId('mail-message-more'))
      await expect(page.getByTestId('mail-menu-toSpam')).toBeVisible({
        timeout: 10000,
      })
      await clickReady(page.getByTestId('mail-menu-toSpam'))
      await expect(page.getByTestId('mail-message-list')).toBeVisible({
        timeout: 45000,
      })
      await attachScreenshot(page, 'mail-spam-01-after')
    })

    await step('Open Spam folder', async () => {
      await openFolderByType(page, FOLDER_TYPES.SPAM)
      await attachScreenshot(page, 'mail-spam-02-folder')
    })
  })

  test('marks spam as not spam and restores to Inbox', async ({ page }) => {
    test.setTimeout(240000)
    await loginAsTestUser(page)
    const opened = await openFirstInboxMessage(page)
    test.skip(!opened, 'Inbox is empty')

    const subject = opened.viewSubject
    test.skip(!subject, 'Opened message has empty subject')

    await step('Mark as spam', async () => {
      await clickReady(page.getByTestId('mail-message-more'))
      await expect(page.getByTestId('mail-menu-toSpam')).toBeVisible({
        timeout: 10000,
      })
      await clickReady(page.getByTestId('mail-menu-toSpam'))
      await expect(page.getByTestId('mail-message-list')).toBeVisible({
        timeout: 45000,
      })
      console.log(`  → Marked as spam: ${subject}`)
    })

    await step('Open message in Spam', async () => {
      await openFolderByType(page, FOLDER_TYPES.SPAM)
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
      await attachScreenshot(page, 'mail-not-spam-01-in-spam')
    })

    await step('Overflow → Not spam', async () => {
      await clickReady(page.getByTestId('mail-message-more'))
      await expect(page.getByTestId('mail-menu-notSpam')).toBeVisible({
        timeout: 10000,
      })
      await clickReady(page.getByTestId('mail-menu-notSpam'))
      await expect(page.getByTestId('mail-message-list')).toBeVisible({
        timeout: 45000,
      })
      console.log(`  → Marked as not spam: ${subject}`)
      await attachScreenshot(page, 'mail-not-spam-02-after')
    })

    await step('Confirm message is back in Inbox', async () => {
      await openFolderByType(page, FOLDER_TYPES.INBOX)
      const item = page
        .getByTestId('mail-message-item')
        .filter({ hasText: subject })
        .first()
      await expect(item).toBeVisible({ timeout: 60000 })
      console.log(`  → Restored in Inbox: ${subject}`)
      await attachScreenshot(page, 'mail-not-spam-03-inbox')
    })
  })

  test('deletes message to Trash via toolbar', async ({ page }) => {
    test.setTimeout(180000)
    await loginAsTestUser(page)
    const opened = await openFirstInboxMessage(page)
    test.skip(!opened, 'Inbox is empty')

    await step('Toolbar delete → confirm', async () => {
      await clickReady(page.getByTestId('mail-action-delete'))
      await expect(page.getByTestId('mail-delete-dialog')).toBeVisible({
        timeout: 15000,
      })
      await clickReady(page.getByTestId('mail-delete-confirm'))
      await expect(page.getByTestId('mail-delete-dialog')).toBeHidden({
        timeout: 30000,
      })
      await expect(page.getByTestId('mail-message-list')).toBeVisible({
        timeout: 30000,
      })
      console.log('  → Delete confirmed, back on list')
      await attachScreenshot(page, 'mail-delete-01-after')
    })
  })

  test('sends reply and forward to self', async ({ page }) => {
    test.setTimeout(240000)
    await loginAsTestUser(page)
    const opened = await openFirstInboxMessage(page)
    test.skip(!opened, 'Inbox is empty')

    await step('Reply → send', async () => {
      await clickReady(page.getByTestId('mail-action-reply'))
      await expectComposeOpen(page)
      const subject = await readComposeSubject(page)
      expect(subject.toLowerCase()).toMatch(/^re:/)
      await sendCompose(page)
      // Reply send returns to the message view (not always the list).
      await expect(
        page
          .getByTestId('mail-message-view')
          .or(page.getByTestId('mail-message-list'))
      ).toBeVisible({ timeout: 45000 })
      console.log(`  → Reply sent: ${subject}`)
      await attachScreenshot(page, 'mail-send-01-reply')
    })

    await step('Back to inbox for forward', async () => {
      if (await page.getByTestId('mail-message-view').isVisible().catch(() => false)) {
        await clickReady(page.getByTestId('mail-message-back'))
      }
      await waitForInboxList(page)
    })

    const again = await openFirstInboxMessage(page)
    test.skip(!again, 'Inbox empty after reply')

    await step('Forward → fill To → send', async () => {
      await clickReady(page.getByTestId('mail-message-more'))
      await clickReady(page.getByTestId('mail-menu-forward'))
      await expectComposeOpen(page)
      const subject = await readComposeSubject(page)
      expect(subject.toLowerCase()).toMatch(/^fwd:/)
      await fillComposeRecipient(page, composeTo)
      const editor = page
        .getByTestId('mail-compose-body')
        .locator('.q-editor__content')
      await editor.click()
      await editor.fill(`E2E forward body ${Date.now()}`)
      await sendCompose(page)
      await expect(
        page
          .getByTestId('mail-message-view')
          .or(page.getByTestId('mail-message-list'))
      ).toBeVisible({ timeout: 45000 })
      console.log(`  → Forward sent: ${subject}`)
      await attachScreenshot(page, 'mail-send-02-forward')
    })
  })

  test('advanced search by subject runs', async ({ page }) => {
    test.setTimeout(120000)
    await loginAsTestUser(page)
    await waitForInboxList(page)

    const firstSubject = (
      await page
        .getByTestId('mail-message-item')
        .first()
        .locator('.message__subject')
        .innerText()
        .catch(() => '')
    ).trim()
    test.skip(!firstSubject, 'Inbox is empty')

    const token =
      firstSubject
        .split(/\s+/)
        .map((w) => w.replace(/[^a-zA-Z0-9@._-]/g, ''))
        .find((w) => w.length > 4 && !/^(re|fwd)$/i.test(w)) || firstSubject

    await step('Open advanced search and submit subject', async () => {
      await clickReady(page.getByTestId('mail-search'))
      await clickReady(page.getByTestId('mail-search-advanced'))
      await expect(page.getByTestId('mail-advanced-search')).toBeVisible({
        timeout: 15000,
      })
      await page.getByTestId('mail-adv-subject').locator('input').fill(token)
      await clickReady(page.getByTestId('mail-adv-search-submit'))
      await expect(page.getByTestId('mail-advanced-search')).toBeHidden({
        timeout: 15000,
      })
      await expect(page.getByTestId('mail-message-list')).toBeVisible({
        timeout: 30000,
      })
      await waitForInboxList(page)
      console.log(`  → Advanced search subject token: ${token}`)
      await attachScreenshot(page, 'mail-adv-search-01')
    })
  })
})
