import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Checkbox from '@/components/ui/Checkbox.vue'

describe('Checkbox', () => {
  it('renders label content and emits checked value', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
      },
      slots: {
        default: '显示背景',
      },
    })

    expect(wrapper.text()).toContain('显示背景')

    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })
})
