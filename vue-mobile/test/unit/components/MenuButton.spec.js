import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import MenuButton from 'components/common/MenuButton.vue'

describe('MenuButton', () => {
  it('navigates to url on click via router.replace', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/mail', component: { template: '<div />' } },
      ],
    })
    await router.push('/')
    await router.isReady()

    const replaceSpy = vi.spyOn(router, 'replace')

    const wrapper = mount(MenuButton, {
      props: { url: '/mail' },
      slots: { default: 'Mail' },
      global: {
        plugins: [router],
      },
    })

    await wrapper.trigger('click')
    expect(replaceSpy).toHaveBeenCalledWith('/mail')
  })
})
