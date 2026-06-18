import { expect, test } from '@playwright/test'

test('home page exposes the core local-first workflow', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Lottie Lens' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '拖入 Lottie 项目文件夹' })).toBeVisible()
  await expect(page.getByRole('button', { name: '选择文件夹' })).toBeVisible()

  await page.getByLabel('使用帮助').click()

  await expect(page.getByRole('dialog', { name: '快速帮助' })).toBeVisible()
  await expect(page.getByText('文件不会上传到服务器')).toBeVisible()
})
