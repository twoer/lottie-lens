import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from '@/components/ui/Button.vue'

describe('Button', () => {
  it('renders slot content and default button semantics', () => {
    const wrapper = mount(Button, {
      slots: {
        default: '选择文件夹',
      },
    })

    expect(wrapper.get('button').text()).toBe('选择文件夹')
  })

  it('respects disabled state', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })
})
