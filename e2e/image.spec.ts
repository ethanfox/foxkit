import { expect, test } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'

test('image lab accepts a local png and enables download', async ({ page }) => {
  const dir = join(tmpdir(), 'foxkit-e2e')
  await mkdir(dir, { recursive: true })
  const file = join(dir, 'sample.png')
  await sharp({
    create: {
      width: 240,
      height: 160,
      channels: 3,
      background: { r: 255, g: 80, b: 0 },
    },
  })
    .png()
    .toFile(file)

  await page.goto('./image')
  await page.locator('input[type="file"]').first().setInputFiles(file)
  await expect(page.getByText('240×160', { exact: false }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Download' })).toBeEnabled()
  await expect(page.getByText('Processed locally. Nothing is uploaded.')).toBeVisible()
})
