import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('src/core', () => ({
  default: {
    requestAppData: vi.fn(),
  },
}))

import enums from 'src/enums'
import { useCoreStore } from 'src/stores/index-pinia'
import core from 'src/core'

describe('CoreStore auth state', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    enums.init({
      Core: {
        EUserRole: {
          Anonymous: 0,
          NormalUser: 1,
          TenantAdmin: 2,
        },
      },
    })
  })

  it('parses authenticated user data from AppData', () => {
    const store = useCoreStore()

    store.parseAppData({
      User: {
        PublicId: 'user@example.com',
        Role: 1,
      },
    })

    expect(store.user).toEqual({
      PublicId: 'user@example.com',
      Role: 1,
    })
    expect(store.userPublicId).toBe('user@example.com')
    expect(store.userRole).toBe(1)
    expect(store.isUserNormalOrTenant).toBe(true)
  })

  it('falls back to anonymous state when AppData has no user', () => {
    const store = useCoreStore()
    store.userPublicId = 'stale@example.com'
    store.userRole = 1
    store.user = { PublicId: 'stale@example.com', Role: 1 }

    store.parseAppData({})

    expect(store.user).toBe(null)
    expect(store.userPublicId).toBe(null)
    expect(store.userRole).toBe(0)
    expect(store.isUserNormalOrTenant).toBe(false)
  })

  it('logout clears auth state without reloading AppData', async () => {
    const store = useCoreStore()
    store.userPublicId = 'user@example.com'
    store.userRole = 1
    store.user = { PublicId: 'user@example.com', Role: 1 }

    await store.logout()

    expect(store.user).toBe(null)
    expect(store.userPublicId).toBe(null)
    expect(store.userRole).toBe(0)
    expect(core.requestAppData).not.toHaveBeenCalled()
  })
})
