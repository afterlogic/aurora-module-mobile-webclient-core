import { describe, expect, it } from 'vitest'
import textUtils from 'src/utils/text'

describe('textUtils', () => {
  describe('getFriendlySize', () => {
    it('formats bytes / KB / MB / GB', () => {
      expect(textUtils.getFriendlySize(512)).toBe('512 B')
      expect(textUtils.getFriendlySize(2048)).toBe('2 KB')
      expect(textUtils.getFriendlySize(1024 * 1024)).toBe('1 MB')
      expect(textUtils.getFriendlySize(1024 * 1024 * 1024)).toBe('1 GB')
    })
  })

  describe('encodeHtml', () => {
    it('escapes HTML special characters', () => {
      expect(textUtils.encodeHtml(`<a href="x">y's & z</a>`)).toBe(
        '&lt;a href=&quot;x&quot;&gt;y&#039;s &amp; z&lt;/a&gt;'
      )
    })

    it('returns empty string for empty input', () => {
      expect(textUtils.encodeHtml('')).toBe('')
      expect(textUtils.encodeHtml(null)).toBe('')
    })
  })

  describe('htmlToPlain', () => {
    it('strips tags and decodes entities', () => {
      expect(textUtils.htmlToPlain('Hello<br>world')).toContain('Hello')
      expect(textUtils.htmlToPlain('a&nbsp;b')).toBe('a b')
    })
  })
})
