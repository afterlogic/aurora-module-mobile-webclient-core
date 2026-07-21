import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginLayout from 'layouts/LoginLayout.vue'

vi.mock('src/settings', () => ({
  default: {
    getSetting: vi.fn(),
  },
}))

vi.mock('components/common/icons/login/BlurredCircleIcon', () => ({
  default: {
    name: 'BlurredCircleIcon',
    template: '<div data-test-id="blurred-circle" />',
  },
}))

import settings from 'src/settings'

describe('LoginLayout', () => {
  beforeEach(() => {
    settings.getSetting.mockReset()
  })

  it('shows product name heading and default logo when branding logos are empty', () => {
    settings.getSetting.mockImplementation((key) => {
      if (key === 'brandingProductName') return 'Aurora Mobile'
      if (key === 'siteName') return 'Site'
      return ''
    })

    const wrapper = mount(LoginLayout, {
      props: { subheading: 'Sign in' },
      slots: { default: '<form data-test-id="login-slot" />' },
    })

    expect(wrapper.text()).toContain('Aurora Mobile')
    expect(wrapper.text()).toContain('Sign in')
    expect(wrapper.find('[data-test-id="login-slot"]').exists()).toBe(true)
    expect(wrapper.find('.login-page__default-logo').exists()).toBe(true)
    expect(wrapper.find('.login-page__logo').exists()).toBe(false)
  })

  it('renders brandingMobileLoginLogo when set', () => {
    settings.getSetting.mockImplementation((key) => {
      if (key === 'brandingMobileLoginLogo') return '/logo-mobile.png'
      if (key === 'brandingProductName') return 'Aurora'
      return ''
    })

    const wrapper = mount(LoginLayout)

    const logo = wrapper.find('.login-page__logo')
    expect(logo.exists()).toBe(true)
    expect(logo.attributes('src')).toBe('/logo-mobile.png')
  })
})
