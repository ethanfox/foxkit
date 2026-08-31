import { describe, expect, it } from 'vitest'
import { containSize, coverCrop, formatBytes, pixelCrop } from './geometry'

describe('image geometry', () => {
  it('covers a wide source into a square', () => {
    const crop = coverCrop(2000, 1000, 100, 100)
    expect(crop.height).toBe(1)
    expect(crop.width).toBeCloseTo(0.5)
  })

  it('contains a tall source into a wide frame', () => {
    const fit = containSize(100, 200, 400, 200)
    expect(fit.drawH).toBe(200)
    expect(fit.drawW).toBe(100)
  })

  it('converts normalized crop to pixels', () => {
    const crop = pixelCrop({ x: 0.25, y: 0.25, width: 0.5, height: 0.5 }, 100, 80)
    expect(crop.sx).toBe(25)
    expect(crop.sh).toBe(40)
  })

  it('formats bytes', () => {
    expect(formatBytes(800)).toBe('800 B')
    expect(formatBytes(2048)).toBe('2.0 KB')
  })
})
