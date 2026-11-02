import { describe, expect, it } from 'vitest'
import { chunkReloadUrl, installPathname } from 'src/utils/document-url'

describe('installPathname', () => {
  it('keeps the install path while the mobile entry query is present', () => {
    expect(installPathname('/mail/', '?/mobile-version')).toBe('/mail/')
    expect(installPathname('/webmail/index.php', '?/mobile-version')).toBe('/webmail/index.php')
  })

  it('drops a client route that replaced the document path', () => {
    expect(installPathname('/mail', '')).toBe('/')
    expect(installPathname('/mail/1/INBOX/', '')).toBe('/')
    expect(installPathname('/webmail/files/personal/', '')).toBe('/webmail/')
  })

  it('leaves a normal install path unchanged', () => {
    expect(installPathname('/', '')).toBe('/')
    expect(installPathname('/webmail/', '')).toBe('/webmail/')
    expect(installPathname('/webmail/index.php', '')).toBe('/webmail/index.php')
  })
})

describe('chunkReloadUrl', () => {
  it('keeps the mobile entry and puts the route in the hash', () => {
    expect(chunkReloadUrl({
      pathname: '/',
      search: '?/mobile-version',
      hash: '',
    }, '/mail/1/INBOX/')).toBe('/?/mobile-version#/mail/1/INBOX/')
  })

  it('does not request the route path as a document', () => {
    expect(chunkReloadUrl({
      pathname: '/webmail/',
      search: '?/mobile-version',
    }, '/mail')).toBe('/webmail/?/mobile-version#/mail')
  })
})
