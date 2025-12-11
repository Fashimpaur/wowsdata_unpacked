import { test, expect } from '@playwright/test'

test('home renders and shows API health placeholder', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Starter Web' })).toBeVisible()
  await expect(page.getByTestId('health')).toBeVisible()
})
