import { describe, expect, it } from 'vitest'
import { validators } from 'src/utils/validation'

describe('validators', () => {
  describe('required', () => {
    it('rejects empty values', () => {
      expect(validators.required('')).toBe(false)
      expect(validators.required(null)).toBe(false)
      expect(validators.required(undefined)).toBe(false)
      expect(validators.required(0)).toBe(false)
    })

    it('accepts non-empty values', () => {
      expect(validators.required('x')).toBe(true)
      expect(validators.required(1)).toBe(true)
      expect(validators.required(true)).toBe(true)
    })
  })

  describe('minLength', () => {
    it('checks string length against the threshold', () => {
      const atLeast3 = validators.minLength(3)
      expect(atLeast3('ab')).toBe(false)
      expect(atLeast3('abc')).toBe(true)
      expect(atLeast3('abcd')).toBe(true)
    })
  })
})
