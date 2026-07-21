import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from 'components/common/AppButton.vue'

describe('AppButton', () => {
  it('renders the label', () => {
    const wrapper = mount(AppButton, {
      props: { label: 'Save' },
    })

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.classes()).toContain('app-button')
  })

  it('disables the button when disabled=true', () => {
    const wrapper = mount(AppButton, {
      props: { label: 'Save', disabled: true },
    })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('shows loading spinner when loading=true', () => {
    const wrapper = mount(AppButton, {
      props: { label: 'Save', loading: true },
    })

    expect(wrapper.find('.q-spinner').exists()).toBe(true)
  })
})
