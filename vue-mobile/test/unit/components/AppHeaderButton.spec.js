import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeaderButton from 'components/common/AppHeaderButton.vue'

describe('AppHeaderButton', () => {
  it('renders icon header button with default styles', () => {
    const wrapper = mount(AppHeaderButton, {
      props: { icon: 'menu' },
    })

    const button = wrapper.findComponent({ name: 'QBtn' })
    expect(button.props('icon')).toBe('menu')
    expect(button.props('color')).toBe('black')
    expect(button.props('round')).toBe(true)
    expect(button.props('dense')).toBe(true)
    expect(button.props('flat')).toBe(true)
  })

  it('renders text header button with label', () => {
    const wrapper = mount(AppHeaderButton, {
      props: {
        variant: 'text',
        label: 'Save',
      },
    })

    const button = wrapper.findComponent({ name: 'QBtn' })
    expect(button.props('label')).toBe('Save')
    expect(button.props('color')).toBe('primary')
    expect(button.props('noCaps')).toBe(true)
    expect(button.props('round')).toBe(false)
    expect(button.props('size')).toBe('14px')
    expect(button.classes()).toContain('app-header-button--text')
  })

  it('forwards attrs such as data-test-id', () => {
    const wrapper = mount(AppHeaderButton, {
      props: { icon: 'close' },
      attrs: {
        'data-test-id': 'header-close',
      },
    })

    expect(wrapper.attributes('data-test-id')).toBe('header-close')
  })

  it('renders slot content instead of icon prop', () => {
    const wrapper = mount(AppHeaderButton, {
      props: { icon: 'menu' },
      slots: {
        default: '<span class="custom-action">Action</span>',
      },
    })

    expect(wrapper.find('.custom-action').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'QBtn' }).props('icon')).toBeUndefined()
  })
})
