import { describe, expect, it } from 'vitest'
import { hexToRgb, hslToRgb, normalizeHex, rgbToHex, rgbToHsl } from './color'

describe('color', () => {
  it('normalizes short hex', () => {
    expect(normalizeHex('#abc')).toBe('#aabbcc')
  })

  it('round-trips rgb hex', () => {
    expect(rgbToHex(...hexToRgb('#ff4d00'))).toBe('#ff4d00')
  })

  it('converts rgb to hsl and back', () => {
    const [h, s, l] = rgbToHsl(255, 77, 0)
    const [r, g, b] = hslToRgb(h, s, l)
    expect(r).toBeGreaterThan(250)
    expect(b).toBeLessThan(5)
    expect(g).toBeGreaterThan(70)
    expect(g).toBeLessThan(90)
  })
})
