import { describe, expect, it } from 'vitest'
import { pickHighestOrder } from 'src/utils/common'

describe('pickHighestOrder', () => {
  const items = [
    { name: 'settings' },
    { name: 'mail', pageName: 'mail' },
    { name: 'files' },
  ]

  it('returns the first item whose name matches the priority list', () => {
    expect(pickHighestOrder(items, ['contacts', 'mail', 'files']).name).toBe('mail')
  })

  it('falls back to the first object when nothing matches', () => {
    expect(pickHighestOrder(items, ['contacts']).name).toBe('settings')
  })

  it('returns null for an empty list', () => {
    expect(pickHighestOrder([], ['mail'])).toBeNull()
  })
})
