import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import coreWebApi from 'src/api/core-web-api'
import { getApiHost } from 'src/api/helpers'
import { switchToDesktopVersion, useAutomaticLayout } from 'src/utils/mobile-layout'

vi.mock('src/api/core-web-api', () => ({ default: { setMobile: vi.fn() } }))
vi.mock('src/api/helpers', () => ({ getApiHost: vi.fn() }))

describe('changing the mobile layout preference', () => {
  const assign = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal('window', { location: { assign, pathname: '/aurora/' } })
    getApiHost.mockReturnValue('https://example.test/aurora/')
  })

  afterEach(() => vi.unstubAllGlobals())

  it('opens the installation root after saving the desktop preference', async () => {
    coreWebApi.setMobile.mockResolvedValue(true)
    await switchToDesktopVersion()
    expect(coreWebApi.setMobile).toHaveBeenCalledWith(false)
    expect(assign).toHaveBeenCalledWith('https://example.test/aurora/')
  })

  it('clears the preference before returning to automatic layout selection', async () => {
    coreWebApi.setMobile.mockResolvedValue(true)
    await useAutomaticLayout()
    expect(coreWebApi.setMobile).toHaveBeenCalledWith('auto')
    expect(assign).toHaveBeenCalledWith('https://example.test/aurora/')
  })

  it('stays on the current page when saving the preference fails', async () => {
    coreWebApi.setMobile.mockRejectedValue(new Error('Request failed'))
    await switchToDesktopVersion()
    expect(assign).not.toHaveBeenCalled()
  })
})
