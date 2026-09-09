import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const getAppData = vi.fn()
const showError = vi.fn()
const getModules = vi.fn(() => Promise.resolve())
const initModules = vi.fn()

vi.mock('src/api/core-web-api', () => ({
  default: {
    getAppData: (...args) => getAppData(...args),
  },
}))

vi.mock('src/utils/notification', () => ({
  default: {
    showError: (...args) => showError(...args),
  },
}))

vi.mock('boot/i18n', () => ({
  i18n: {
    global: {
      tc: (key) => key,
    },
  },
}))

vi.mock('vue-cookies', () => ({
  default: {
    set: vi.fn(),
    get: vi.fn(),
  },
}))

vi.mock('device-uuid', () => ({
  default: {
    DeviceUUID: () => ({
      get: () => 'test-device-id',
    }),
  },
}))

vi.mock('src/modules-manager', () => ({
  default: {
    getModules: (...args) => getModules(...args),
    initModules: (...args) => initModules(...args),
  },
}))

import enums from 'src/enums'
import core from 'src/core'
import { useCoreStore } from 'src/stores/index-pinia'

function authError (code = 101) {
  const error = new Error('Invalid token')
  error.errorCode = code
  return error
}

describe('core.requestAppData', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.useRealTimers()

    enums.init({
      Core: {
        EUserRole: {
          Anonymous: 0,
          NormalUser: 1,
          TenantAdmin: 2,
        },
      },
    })

    getAppData.mockReset()
    showError.mockReset()
    getModules.mockReset()
    initModules.mockReset()
    getModules.mockResolvedValue(undefined)
  })

  async function resetFailureCounter () {
    getAppData.mockResolvedValueOnce({ User: null })
    await core.requestAppData()
    getAppData.mockReset()
    getModules.mockClear()
    initModules.mockClear()
  }

  it('loads AppData and parses anonymous user on success', async () => {
    await resetFailureCounter()
    getAppData.mockResolvedValueOnce({})

    await core.requestAppData()

    const store = useCoreStore()
    expect(store.user).toBe(null)
    expect(store.userRole).toBe(0)
    expect(getModules).toHaveBeenCalled()
    expect(initModules).toHaveBeenCalled()
  })

  it('retries once after InvalidToken so anonymous AppData can open login', async () => {
    await resetFailureCounter()
    getAppData
      .mockRejectedValueOnce(authError(101))
      .mockResolvedValueOnce({})

    await core.requestAppData()

    expect(getAppData).toHaveBeenCalledTimes(2)
    const store = useCoreStore()
    expect(store.user).toBe(null)
    expect(store.userRole).toBe(0)
  })

  it('does not retry non-auth GetAppData failures', async () => {
    await resetFailureCounter()
    const networkError = new Error('network down')
    getAppData.mockRejectedValueOnce(networkError)

    await expect(core.requestAppData()).rejects.toThrow('network down')
    expect(getAppData).toHaveBeenCalledTimes(1)
  })

  it('hard-rejects after 10 consecutive failures', async () => {
    await resetFailureCounter()
    getAppData.mockRejectedValue(new Error('boom'))

    for (let i = 0; i < 9; i++) {
      await expect(core.requestAppData()).rejects.toThrow('boom')
    }
    await expect(core.requestAppData()).rejects.toThrow('GetAppData failed 10 times in a row')
    expect(getAppData).toHaveBeenCalledTimes(10)
  })

  it('resets consecutive failure count after the failure window', async () => {
    await resetFailureCounter()
    vi.useFakeTimers()
    getAppData.mockRejectedValue(new Error('boom'))

    for (let i = 0; i < 9; i++) {
      await expect(core.requestAppData()).rejects.toThrow('boom')
    }

    await vi.advanceTimersByTimeAsync(30001)

    for (let i = 0; i < 9; i++) {
      await expect(core.requestAppData()).rejects.toThrow('boom')
    }
    await expect(core.requestAppData()).rejects.toThrow('GetAppData failed 10 times in a row')
    expect(getAppData).toHaveBeenCalledTimes(19)
  })
})
