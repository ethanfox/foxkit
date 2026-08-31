import { colorCss } from '@/lib/color'
import type { ColorStop, GradientDocument } from './types'

export function sortedStops(stops: ColorStop[]): ColorStop[] {
  return [...stops].sort((a, b) => a.position - b.position)
}

export function stopList(stops: ColorStop[]): string {
  return sortedStops(stops)
    .map((stop) => `${colorCss(stop.hex, stop.alpha)} ${stop.position}%`)
    .join(', ')
}

export function interpolationPrefix(doc: GradientDocument): string {
  return doc.interpolation === 'oklab' ? 'in oklab ' : ''
}

export function gradientCssValue(doc: GradientDocument): string | null {
  if (doc.type === 'freeform') return null
  const stops = stopList(doc.stops)
  const interp = interpolationPrefix(doc)
  if (doc.type === 'linear') {
    return `linear-gradient(${interp}${doc.angle}deg, ${stops})`
  }
  if (doc.type === 'radial') {
    return `radial-gradient(${interp}circle at ${doc.radialPosition.x}% ${doc.radialPosition.y}%, ${stops})`
  }
  return `conic-gradient(${interp}from ${doc.conicAngle}deg at 50% 50%, ${stops})`
}

export function cssBackgroundDeclaration(doc: GradientDocument): string | null {
  const value = gradientCssValue(doc)
  if (!value) return null
  return `background: ${value};`
}

export function cssCustomProperties(doc: GradientDocument): string | null {
  const value = gradientCssValue(doc)
  if (!value) return null
  return `:root {\n  --foxkit-gradient: ${value};\n}`
}
