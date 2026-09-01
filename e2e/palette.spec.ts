import { expect, test } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'

test('palette extracts colors from a local image', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  const dir = join(tmpdir(), 'foxkit-e2e')
  await mkdir(dir, { recursive: true })
  const file = join(dir, 'palette.png')
  const left = await sharp({
    create: { width: 120, height: 80, channels: 3, background: { r: 255, g: 0, b: 0 } },
  })
    .png()
    .toBuffer()
  const right = await sharp({
    create: { width: 120, height: 80, channels: 3, background: { r: 0, g: 0, b: 255 } },
  })
    .png()
    .toBuffer()
  await sharp({
    create: { width: 240, height: 80, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .composite([
      { input: left, left: 0, top: 0 },
      { input: right, left: 120, top: 0 },
    ])
    .png()
    .toFile(file)

  await page.goto('./palette')
  await page.locator('input[type="file"]').first().setInputFiles(file)
  await expect(page.getByRole('button', { name: /Move color/ }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Download JSON' })).toBeEnabled()
  await page.getByRole('button', { name: 'Copy / export' }).click()
  await page.getByRole('button', { name: 'Copy HEX' }).click()
  await expect(page.getByText(/HEX copied|Could not copy/)).toBeVisible()
})
