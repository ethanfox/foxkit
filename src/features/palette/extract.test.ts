import { describe, expect, it } from 'vitest'
import { extractPalette, paletteCss, paletteHexList, sampleColor } from './extract'
import type { PixelBuffer } from './types'

function buffer(pixels: number[], width: number, height: number): PixelBuffer {
  return { data: new Uint8ClampedArray(pixels), width, height }
}

describe('palette extract', () => {
  it('pulls red and blue from a two-color image', () => {
    const image = buffer(
      [
        255, 0, 0, 255, 255, 0, 0, 255,
        0, 0, 255, 255, 0, 0, 255, 255,
      ],
      2,
      2,
    )
    const colors = extractPalette(image, 2)
    const hexes = colors.map((color) => color.hex).sort()
    expect(hexes).toEqual(['#0000ff', '#ff0000'])
    expect(colors).toHaveLength(2)
  })

  it('samples the pixel under a point', () => {
    const image = buffer([255, 0, 0, 255, 0, 255, 0, 255], 2, 1)
    expect(sampleColor(image, 0, 0.5)).toBe('#ff0000')
    expect(sampleColor(image, 1, 0.5)).toBe('#00ff00')
  })

  it('formats hex and css', () => {
    const colors = [
      { id: 'a', hex: '#ff4d00', x: 0, y: 0 },
      { id: 'b', hex: '#112233', x: 1, y: 1 },
    ]
    expect(paletteHexList(colors)).toBe('#ff4d00\n#112233')
    expect(paletteCss(colors)).toContain('--color-1: #ff4d00;')
    expect(paletteCss(colors)).toContain('--color-2: #112233;')
  })
})
