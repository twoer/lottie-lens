import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import Dialog from '@/components/ui/Dialog.vue'

describe('Dialog', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders dialog content when open', () => {
    mount(Dialog, {
      attachTo: document.body,
      props: {
        open: true,
        title: '快速帮助',
      },
      slots: {
        default: '本地完成预览和资源检查',
      },
    })

    expect(document.body.textContent).toContain('快速帮助')
    expect(document.body.textContent).toContain('本地完成预览和资源检查')
  })

  it('emits close event from the close button', async () => {
    const wrapper = mount(Dialog, {
      attachTo: document.body,
      props: {
        open: true,
        title: '快速帮助',
      },
    })

    await document.body.querySelector<HTMLButtonElement>('.dialog-close')?.click()

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })
})
