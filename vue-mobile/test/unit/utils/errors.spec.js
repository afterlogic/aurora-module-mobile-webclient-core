import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('boot/i18n', () => ({
  i18n: {
    global: {
      tc: (key) => key,
    },
  },
}))

import errors from 'src/utils/errors'

describe('errors.getTextFromResponse', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    errors.init({
      module_errors: {
        Mail: {
          4002: 'The username or password you entered is incorrect.',
        },
      },
    })
  })

  it('shows credentials text for Mail 4002 without raw IMAP ErrorMessage', () => {
    const text = errors.getTextFromResponse({
      Module: 'Mail',
      ErrorCode: 4002,
      ErrorMessage: ':TAG1 NO (AUTHENTICATIONFAILED) Authentication failed.',
    })

    expect(text).toBe('The username or password you entered is incorrect.')
    expect(text).not.toMatch(/TAG1|AUTHENTICATIONFAILED/)
    expect(console.warn).toHaveBeenCalled()
  })

  it('strips accountId-prefixed IMAP detail for Mail 4002', () => {
    const text = errors.getTextFromResponse({
      Module: 'Mail',
      ErrorCode: 4002,
      ErrorMessage: '12:TAG2 NO (AUTHENTICATIONFAILED) Authentication failed.',
    })

    expect(text).toBe('The username or password you entered is incorrect.')
    expect(text).not.toContain('TAG2')
  })

  it('keeps human-readable ErrorMessage for Mail 4002 (e.g. Gmail hint)', () => {
    const text = errors.getTextFromResponse({
      Module: 'Mail',
      ErrorCode: 4002,
      ErrorMessage: 'Try deleting your GMail account and creating it again.',
    })

    expect(text).toContain('The username or password you entered is incorrect.')
    expect(text).toContain('Try deleting your GMail account and creating it again.')
  })

  it('does not append literal AuthError detail for core AuthError', () => {
    const text = errors.getTextFromResponse({
      Module: 'Core',
      ErrorCode: 102,
      ErrorMessage: 'AuthError',
    })

    expect(text).toBe('COREWEBCLIENT.ERROR_PASS_INCORRECT')
    expect(text).not.toContain('AuthError')
  })

  it('still appends non-technical ErrorMessage for other codes', () => {
    const text = errors.getTextFromResponse(
      {
        Module: 'Core',
        ErrorCode: 0,
        ErrorMessage: 'Something went wrong on the server',
      },
      'Fallback error'
    )

    expect(text).toBe('Fallback error (Something went wrong on the server)')
  })
})

describe('errors for an untrusted device', () => {
  it('treats UntrustedDevice (117) like InvalidToken and AuthError, so the session is ended', () => {
    expect(errors.isAuthError(101)).toBe(true)
    expect(errors.isAuthError(102)).toBe(true)
    expect(errors.isAuthError(117)).toBe(true)
    expect(errors.isAuthError(108)).toBe(false)
  })

  it('shows the session ended text for UntrustedDevice instead of Unknown error', () => {
    const text = errors.getTextFromResponse({ Module: '', ErrorCode: 117 })

    expect(text).toBe('COREWEBCLIENT.ERROR_UNTRUSTED_DEVICE')
  })
})
