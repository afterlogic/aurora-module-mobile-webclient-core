const { expect } = require('@playwright/test')
const { step, attachScreenshot } = require('./login')
const { waitForListReady, clickReady } = require('./ready')

const listReadyOptions = {
  itemTestIds: 'contacts-item',
  emptyTestId: 'contacts-empty',
  spinnerSelectors: [
    '.contacts__loader_initial',
    '.contacts__loader_initial .q-spinner-dots',
  ],
  timeout: 60000,
}

async function openContacts(page) {
  await clickReady(page.getByTestId('nav-contacts'))
  await expect(page.getByTestId('contacts-list')).toBeVisible({
    timeout: 60000,
  })
  await waitForListReady(page, listReadyOptions)
}

async function fillContactsField(page, testId, value) {
  const root = page.getByTestId(testId)
  const input = root.locator('input').first()
  await expect(input).toBeVisible({ timeout: 15000 })
  await input.fill(value)
}

async function createContactViaFab(page, { fullName, email }) {
  await clickReady(page.getByTestId('contacts-create-fab'))
  await expect(page.getByTestId('contacts-create-contact')).toBeVisible({
    timeout: 15000,
  })
  await clickReady(page.getByTestId('contacts-create-contact'))
  await expect(page.getByTestId('contacts-edit')).toBeVisible({
    timeout: 30000,
  })
  await fillContactsField(page, 'contacts-edit-name', fullName)
  await fillContactsField(page, 'contacts-edit-email', email)
  await clickReady(page.getByTestId('contacts-edit-save'))
  await expect(page.getByTestId('contacts-view')).toBeVisible({
    timeout: 45000,
  })
  await expect(page.getByTestId('contacts-view-name')).toContainText(fullName, {
    timeout: 15000,
  })
}

async function openContactByName(page, fullName) {
  const item = page
    .getByTestId('contacts-item')
    .filter({ hasText: fullName })
    .first()
  await expect(item).toBeVisible({ timeout: 30000 })
  await clickReady(item)
  await expect(page.getByTestId('contacts-view')).toBeVisible({
    timeout: 30000,
  })
}

async function deleteOpenedContact(page, fullName) {
  await clickReady(page.getByTestId('contacts-view-more'))
  await expect(page.getByTestId('contacts-menu-delete')).toBeVisible({
    timeout: 10000,
  })
  await clickReady(page.getByTestId('contacts-menu-delete'))
  await expect(page.getByTestId('contacts-delete-dialog')).toBeVisible({
    timeout: 15000,
  })
  await clickReady(page.getByTestId('contacts-delete-confirm'))
  await expect(page.getByTestId('contacts-delete-dialog')).toBeHidden({
    timeout: 45000,
  })
  await expect(page.getByTestId('contacts-list')).toBeVisible({
    timeout: 30000,
  })
  await waitForListReady(page, listReadyOptions)
  await expect(
    page.getByTestId('contacts-item').filter({ hasText: fullName })
  ).toHaveCount(0, { timeout: 30000 })
}

module.exports = {
  listReadyOptions,
  openContacts,
  fillContactsField,
  createContactViaFab,
  openContactByName,
  deleteOpenedContact,
  waitForListReady,
  clickReady,
  step,
  attachScreenshot,
}
