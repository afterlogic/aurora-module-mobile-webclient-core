import { describe, expect, it } from 'vitest'
import addressUtils from 'src/utils/address'

describe('addressUtils', () => {
  describe('isCorrectEmail', () => {
    it('accepts plain emails', () => {
      expect(addressUtils.isCorrectEmail('user@example.com')).toBe(true)
    })

    it('rejects invalid emails', () => {
      expect(addressUtils.isCorrectEmail('not-an-email')).toBe(false)
      expect(addressUtils.isCorrectEmail('')).toBe(false)
    })
  })

  describe('getFullEmail', () => {
    it('builds "Name <email>" form', () => {
      expect(addressUtils.getFullEmail('Alice', 'a@example.com')).toBe(
        'Alice <a@example.com>'
      )
    })

    it('quotes names that look like emails', () => {
      expect(addressUtils.getFullEmail('x@y.com', 'a@example.com')).toBe(
        '"x@y.com" <a@example.com>'
      )
    })

    it('returns email only when name is empty', () => {
      expect(addressUtils.getFullEmail('', 'a@example.com')).toBe('a@example.com')
    })
  })
})
