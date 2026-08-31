import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('home shows the two tools', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Gradient Studio' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Image Lab' })).toBeVisible()
  await expect(page.getByText('No account. No upload. No nonsense.')).toBeVisible()
})

test('gradient studio copies css', async ({ page }) => {
  await page.goto('./gradient')
  await page.getByRole('button', { name: 'Copy / share' }).click()
  await page.getByRole('button', { name: 'Copy CSS' }).click()
  await expect(page.getByText('CSS copied')).toBeVisible()
})

test('about and privacy are reachable', async ({ page }) => {
  await page.goto('./about')
  await expect(page.getByRole('heading', { name: 'About FoxKit' })).toBeVisible()
  await page.goto('./privacy')
  await expect(page.getByRole('heading', { name: 'Privacy' })).toBeVisible()
})

test('home has no serious axe violations', async ({ page }) => {
  await page.goto('./')
  const results = await new AxeBuilder({ page }).analyze()
  const serious = results.violations.filter(
    (item) => item.impact === 'serious' || item.impact === 'critical',
  )
  expect(serious).toEqual([])
})
