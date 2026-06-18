import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import UploadSection from '@/components/UploadSection.vue'

describe('UploadSection', () => {
  it('renders empty upload state and opens the folder picker', async () => {
    const wrapper = mount(UploadSection, {
      props: {
        fileName: '',
        hasFiles: false,
        isUploadComplete: false,
        showDebugPanel: false,
      },
    })
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})

    expect(wrapper.text()).toContain('拖入 Lottie 项目文件夹')

    await wrapper.get('button').trigger('click')

    expect(clickSpy).toHaveBeenCalledOnce()

    clickSpy.mockRestore()
  })

  it('renders complete state with file name', () => {
    const wrapper = mount(UploadSection, {
      props: {
        fileName: 'data.json',
        hasFiles: true,
        isUploadComplete: true,
        showDebugPanel: false,
      },
    })

    expect(wrapper.text()).toContain('上传完成 - data.json')
    expect(wrapper.text()).toContain('重新选择')
    expect(wrapper.text()).toContain('清空')
  })

  it('emits clear-project from complete state', async () => {
    const wrapper = mount(UploadSection, {
      props: {
        fileName: 'data.json',
        hasFiles: true,
        isUploadComplete: true,
        showDebugPanel: false,
      },
    })

    await wrapper.findAll('button')[1].trigger('click')

    expect(wrapper.emitted('clear-project')).toHaveLength(1)
  })

  it('keeps compact state when files exist and selection is cancelled', () => {
    const wrapper = mount(UploadSection, {
      props: {
        fileName: 'data.json',
        hasFiles: true,
        isUploadComplete: false,
        showDebugPanel: false,
      },
    })

    expect(wrapper.text()).toContain('上传完成 - data.json')
    expect(wrapper.text()).toContain('重新选择')
    expect(wrapper.text()).not.toContain('拖入 Lottie 项目文件夹')
  })
})
