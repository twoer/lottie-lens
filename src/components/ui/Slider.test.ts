import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Slider from '@/components/ui/Slider.vue'

describe('Slider', () => {
  it('emits input and change values as numbers', async () => {
    const wrapper = mount(Slider, {
      props: {
        max: 100,
        min: 0,
        modelValue: 10,
      },
    })
    const input = wrapper.get('input')

    await input.setValue('42')
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42])
    expect(wrapper.emitted('change')?.[0]).toEqual([42])
  })
})
