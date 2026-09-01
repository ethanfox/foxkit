import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const out = resolve('docs/screenshot-home.png')
await mkdir('docs', { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:4173/foxkit/', { waitUntil: 'networkidle' })
await page.screenshot({ path: out, fullPage: true })
await browser.close()
console.log(`Wrote ${out}`)
