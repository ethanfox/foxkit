import { describe, expect, it } from 'vitest'
import { createGradient } from './defaults'
import { cssBackgroundDeclaration, gradientCssValue } from './css'
import { decodeGradientState, encodeGradientState } from './share'

describe('gradient share and css', () => {
  it('encodes and decodes the same configuration', () => {
    const original = createGradient({
      name: 'Share me',
      angle: 42,
      type: 'radial',
    })
    const restored = decodeGradientState(encodeGradientState(original))
    expect(restored?.name).toBe('Share me')
    expect(restored?.angle).toBe(42)
    expect(restored?.type).toBe('radial')
    expect(restored?.stops).toHaveLength(original.stops.length)
  })

  it('builds valid css for linear gradients', () => {
    const doc = createGradient({ type: 'linear', angle: 135 })
    expect(gradientCssValue(doc)).toContain('linear-gradient')
    expect(cssBackgroundDeclaration(doc)).toMatch(/^background:/)
  })

  it('refuses css for freeform', () => {
    const doc = createGradient({ type: 'freeform' })
    expect(gradientCssValue(doc)).toBeNull()
  })
})
