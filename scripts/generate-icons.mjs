import { mkdir, copyFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = resolve(root, 'public/icons/app-icon.svg')
const outDir = resolve(root, 'public/icons')

await mkdir(outDir, { recursive: true })

async function png(size, name, extra = {}) {
  await sharp(source)
    .resize(size, size, { fit: 'contain', background: extra.background ?? { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(resolve(outDir, name))
}

await png(192, 'icon-192.png')
await png(512, 'icon-512.png')

await sharp(source)
  .resize(410, 410, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
  .extend({
    top: 51,
    bottom: 51,
    left: 51,
    right: 51,
    background: { r: 0, g: 0, b: 0, alpha: 1 },
  })
  .png()
  .toFile(resolve(outDir, 'maskable-512.png'))

await copyFile(source, resolve(root, 'public/favicon.svg'))
console.log('Wrote PWA icons')
