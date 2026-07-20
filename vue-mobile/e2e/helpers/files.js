const fs = require('fs')
const path = require('path')
const { expect } = require('@playwright/test')
const { step, attachScreenshot } = require('./login')
const { waitForListReady, clickReady } = require('./ready')

const listReadyOptions = {
  itemTestIds: ['files-item', 'files-folder'],
  emptyTestId: 'files-empty',
  spinnerSelectors: ['.q-linear-progress'],
  timeout: 60000,
}

const defaultFixturePath = path.join(__dirname, '..', 'fixtures', 'e2e-attach.txt')

async function openFiles(page) {
  await clickReady(page.getByTestId('nav-files'))
  await expect(page.getByTestId('files-list')).toBeVisible({
    timeout: 60000,
  })
  await waitForListReady(page, listReadyOptions)
}

async function waitForFilesList(page) {
  await expect(page.getByTestId('files-list')).toBeVisible({
    timeout: 30000,
  })
  await waitForListReady(page, listReadyOptions)
}

async function uploadFileViaFab(page, uniqueName, fixturePath = defaultFixturePath) {
  await clickReady(page.getByTestId('files-create-fab'))
  await expect(page.getByTestId('files-upload-file')).toBeVisible({
    timeout: 15000,
  })

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByTestId('files-upload-file').click(),
  ])
  await fileChooser.setFiles({
    name: uniqueName,
    mimeType: 'text/plain',
    buffer: fs.readFileSync(fixturePath),
  })

  const item = page
    .getByTestId('files-item')
    .filter({ hasText: uniqueName })
    .first()
  await expect(item).toBeVisible({ timeout: 90000 })
  return item
}

async function openFileByName(page, name) {
  const item = page.getByTestId('files-item').filter({ hasText: name }).first()
  await expect(item).toBeVisible({ timeout: 30000 })
  await clickReady(item)
  await expect(page.getByTestId('files-view')).toBeVisible({ timeout: 30000 })
}

async function deleteOpenedFile(page, name) {
  await expect(page.getByTestId('files-view-delete')).toBeVisible({
    timeout: 15000,
  })
  await clickReady(page.getByTestId('files-view-delete'))
  await expect(page.getByTestId('files-delete-dialog')).toBeVisible({
    timeout: 15000,
  })
  await clickReady(page.getByTestId('files-delete-confirm'))
  await expect(page.getByTestId('files-delete-dialog')).toBeHidden({
    timeout: 45000,
  })
  if (await page.getByTestId('files-view').isVisible().catch(() => false)) {
    await clickReady(page.getByTestId('files-view-back'))
  }
  await waitForFilesList(page)
  await expect(
    page.getByTestId('files-item').filter({ hasText: name })
  ).toHaveCount(0, { timeout: 60000 })
}

module.exports = {
  listReadyOptions,
  openFiles,
  waitForFilesList,
  uploadFileViaFab,
  openFileByName,
  deleteOpenedFile,
  waitForListReady,
  clickReady,
  step,
  attachScreenshot,
}
