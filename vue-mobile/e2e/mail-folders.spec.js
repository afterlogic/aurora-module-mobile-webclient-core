const { test, expect } = require('@playwright/test')
const { loginAsTestUser, step, attachScreenshot } = require('./helpers/login')
const {
  FOLDER_TYPES,
  waitForInboxList,
  openFolderByType,
  openMailDrawer,
} = require('./helpers/mail')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)

test.describe('Mobile mail folders', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('opens drawer and switches Inbox → Sent → Trash → Spam → Inbox', async ({
    page,
  }) => {
    test.setTimeout(180000)
    await loginAsTestUser(page)
    await waitForInboxList(page)

    await step('Open drawer and expect folders', async () => {
      await openMailDrawer(page)
      const count = await page.getByTestId('mail-folder-item').count()
      console.log(`  → Folder items: ${count}`)
      expect(count).toBeGreaterThan(0)
      await attachScreenshot(page, 'mail-drawer-01-open')
      await page
        .locator(
          `[data-test-id="mail-folder-item"][data-folder-type="${FOLDER_TYPES.INBOX}"]`
        )
        .first()
        .click()
      await expect(page.getByTestId('mail-message-list')).toBeVisible({
        timeout: 30000,
      })
    })

    await step('Switch to Sent', async () => {
      await openFolderByType(page, FOLDER_TYPES.SENT)
      await expect(page.getByTestId('mail-folder-name')).toBeVisible()
      const name = (
        await page.getByTestId('mail-folder-name').innerText()
      ).trim()
      console.log(`  → Current folder label: ${name}`)
      await attachScreenshot(page, 'mail-drawer-02-sent')
    })

    await step('Switch to Trash', async () => {
      await openFolderByType(page, FOLDER_TYPES.TRASH)
      await attachScreenshot(page, 'mail-drawer-03-trash')
    })

    await step('Switch to Spam', async () => {
      await openFolderByType(page, FOLDER_TYPES.SPAM)
      await attachScreenshot(page, 'mail-drawer-04-spam')
    })

    await step('Return to Inbox', async () => {
      await openFolderByType(page, FOLDER_TYPES.INBOX)
      await attachScreenshot(page, 'mail-drawer-05-inbox')
    })
  })
})
