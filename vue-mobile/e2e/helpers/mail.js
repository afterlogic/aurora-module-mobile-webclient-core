const { expect } = require('@playwright/test')
const { step, attachScreenshot, fieldControl } = require('./login')
const { waitForListReady, clickReady } = require('./ready')

const FOLDER_TYPES = {
  INBOX: 1,
  SENT: 2,
  DRAFTS: 3,
  SPAM: 4,
  TRASH: 5,
}

const listReadyOptions = {
  itemTestIds: 'mail-message-item',
  emptyTestId: 'mail-empty-folder',
  spinnerSelectors: [
    '.messages__loader_initial',
    '.messages__loader_initial .q-spinner-dots',
  ],
  timeout: 60000,
}

async function waitForInboxList(page) {
  await expect(page.getByTestId('mail-message-list')).toBeVisible({
    timeout: 60000,
  })
  await waitForListReady(page, listReadyOptions)
}

/**
 * Wait for inbox list and open the first message.
 * @returns {{ listSubject: string, viewSubject: string } | null}
 */
async function openFirstInboxMessage(page) {
  await step('Wait for inbox list', async () => {
    await waitForInboxList(page)
  })

  const items = page.getByTestId('mail-message-item')
  const count = await items.count()
  if (count === 0) {
    await attachScreenshot(page, 'mail-inbox-empty')
    return null
  }

  const listSubject = (
    await items
      .first()
      .locator('.message__subject')
      .innerText()
      .catch(() => '')
  ).trim()

  await step('Open first inbox message', async () => {
    await clickReady(items.first())
    await expect(page.getByTestId('mail-message-view')).toBeVisible({
      timeout: 30000,
    })
    await expect(page.getByTestId('mail-message-subject')).toBeVisible({
      timeout: 60000,
    })
    await expect(
      page.getByTestId('mail-message-view').locator('.messages__loader')
    ).toHaveCount(0, { timeout: 30000 })
  })

  const viewSubject = (
    await page.getByTestId('mail-message-subject').innerText()
  ).trim()

  return { listSubject, viewSubject }
}

async function expectComposeOpen(page) {
  await expect(page.getByTestId('mail-compose')).toBeVisible({
    timeout: 30000,
  })
}

async function readComposeSubject(page) {
  return (await fieldControl(page, 'mail-compose-subject').inputValue()).trim()
}

async function closeComposeWithoutSending(page) {
  await step('Close compose without sending', async () => {
    await clickReady(page.getByTestId('mail-compose-back'))
    const discardDialog = page.getByTestId('mail-compose-discard-dialog')
    if (await discardDialog.isVisible().catch(() => false)) {
      await clickReady(page.getByTestId('mail-compose-discard-ok'))
      await expect(discardDialog).toBeHidden({ timeout: 15000 })
    } else {
      // Fallback for older discard UI.
      const discardOk = page.getByRole('button', { name: /^OK$/i })
      if (await discardOk.isVisible().catch(() => false)) {
        await discardOk.click()
      }
    }
    await expect(page.getByTestId('mail-compose')).toBeHidden({
      timeout: 30000,
    })
  })
}

async function openMailDrawer(page) {
  await clickReady(page.getByTestId('mail-folder-menu'))
  await expect(page.getByTestId('mail-drawer')).toBeVisible({
    timeout: 15000,
  })
  await expect(page.getByTestId('mail-folder-item').first()).toBeVisible({
    timeout: 15000,
  })
}

async function openFolderByType(page, folderType) {
  await openMailDrawer(page)
  const folder = page
    .locator(
      `[data-test-id="mail-folder-item"][data-folder-type="${folderType}"]`
    )
    .first()
  await expect(folder).toBeVisible({ timeout: 15000 })
  const name = (await folder.getAttribute('data-folder-name')) || ''
  console.log(`  → Opening folder type=${folderType} name=${name}`)
  await clickReady(folder)
  await expect(page.getByTestId('mail-message-list')).toBeVisible({
    timeout: 30000,
  })
  await waitForListReady(page, listReadyOptions)
  return name
}

async function fillComposeRecipient(page, email, fieldTestId = 'mail-compose-to') {
  const field = page.getByTestId(fieldTestId)
  await field.locator('.q-field__control, .q-field__native').first().click()
  const input = field.locator('input').first()
  await input.fill(email, { force: true })

  const option = page.getByRole('option', { name: email }).first()
  await expect(option).toBeVisible({ timeout: 15000 })
  await option.click()

  await expect(field.locator('.recipients-input__chip').first()).toBeVisible({
    timeout: 15000,
  })
  await expect(page.getByRole('dialog')).toBeHidden({ timeout: 10000 }).catch(
    () => undefined
  )
}

async function sendCompose(page) {
  await clickReady(page.getByTestId('mail-compose-send'))
  await expect(page.getByTestId('mail-compose')).toBeHidden({
    timeout: 60000,
  })
}

async function openFolderByName(page, folderName) {
  await openMailDrawer(page)
  const folder = page
    .locator(
      `[data-test-id="mail-folder-item"][data-folder-name="${folderName}"]`
    )
    .first()
  await expect(folder).toBeVisible({ timeout: 15000 })
  await clickReady(folder)
  await expect(page.getByTestId('mail-message-list')).toBeVisible({
    timeout: 30000,
  })
  await waitForListReady(page, listReadyOptions)
  return folderName
}

async function longPressMessageItem(page, item) {
  const box = await item.boundingBox()
  if (!box) {
    throw new Error('mail-message-item has no bounding box for long-press')
  }
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.waitForTimeout(750)
  await page.mouse.up()
}

module.exports = {
  FOLDER_TYPES,
  waitForInboxList,
  openFirstInboxMessage,
  expectComposeOpen,
  readComposeSubject,
  closeComposeWithoutSending,
  openMailDrawer,
  openFolderByType,
  openFolderByName,
  longPressMessageItem,
  fillComposeRecipient,
  sendCompose,
  waitForListReady,
  listReadyOptions,
  clickReady,
}
