import { uid } from '@/lib/color'
import type { ColorStop, GradientDocument, MeshPoint } from './types'

export function defaultStops(): ColorStop[] {
  return [
    { id: uid('stop'), hex: '#ff4d00', alpha: 1, position: 0 },
    { id: uid('stop'), hex: '#2b0b3f', alpha: 1, position: 100 },
  ]
}

export function defaultPoints(): MeshPoint[] {
  return [
    { id: uid('pt'), hex: '#ff4d00', alpha: 1, x: 0.28, y: 0.32, radius: 0.55 },
    { id: uid('pt'), hex: '#2b0b3f', alpha: 1, x: 0.72, y: 0.68, radius: 0.6 },
    { id: uid('pt'), hex: '#fff3e8', alpha: 0.85, x: 0.55, y: 0.22, radius: 0.35 },
  ]
}

export function createGradient(partial?: Partial<GradientDocument>): GradientDocument {
  return {
    version: 1,
    id: uid('grad'),
    name: 'Untitled gradient',
    type: 'linear',
    angle: 135,
    radialPosition: { x: 50, y: 50 },
    conicAngle: 0,
    stops: defaultStops(),
    points: defaultPoints(),
    interpolation: 'oklab',
    aspect: 'square',
    width: 1080,
    height: 1080,
    scale: 1,
    canvasBackground: 'transparent',
    solidColor: '#000000',
    showGrid: false,
    updatedAt: Date.now(),
    ...partial,
  }
}
