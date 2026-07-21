import { describe, expect, it } from 'vitest'
import types from 'src/utils/types'

describe('types utils', () => {
  it('pInt parses integers and uses defaults', () => {
    expect(types.pInt('42')).toBe(42)
    expect(types.pInt('x', 7)).toBe(7)
    expect(types.pInt(undefined)).toBe(0)
  })

  it('roundNumber rounds to given decimals', () => {
    expect(types.roundNumber(1.26, 1)).toBe(1.3)
    expect(types.roundNumber(1.24, 1)).toBe(1.2)
  })

  it('isNonEmptyString / pBool / pArray normalize values', () => {
    expect(types.isNonEmptyString('a')).toBe(true)
    expect(types.isNonEmptyString('')).toBe(false)
    expect(types.pBool(true)).toBe(true)
    expect(types.pBool('yes', false)).toBe(false)
    expect(types.pArray([1])).toEqual([1])
    expect(types.pArray(null, [2])).toEqual([2])
  })
})
