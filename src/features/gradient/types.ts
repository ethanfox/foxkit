export type GradientType = 'linear' | 'radial' | 'conic' | 'freeform'
export type Interpolation = 'oklab' | 'srgb'
export type AspectId =
  | 'square'
  | '4:3'
  | '3:2'
  | '16:9'
  | '9:16'
  | 'banner'
  | 'custom'

export interface ColorStop {
  id: string
  hex: string
  alpha: number
  position: number
}

export interface MeshPoint {
  id: string
  hex: string
  alpha: number
  x: number
  y: number
  radius: number
}

export interface GradientDocument {
  version: 1
  id: string
  name: string
  type: GradientType
  angle: number
  radialPosition: { x: number; y: number }
  conicAngle: number
  stops: ColorStop[]
  points: MeshPoint[]
  interpolation: Interpolation
  aspect: AspectId
  width: number
  height: number
  scale: 1 | 2 | 3
  canvasBackground: 'transparent' | 'solid'
  solidColor: string
  showGrid: boolean
  updatedAt: number
}

export const ASPECT_PRESETS: {
  id: AspectId
  label: string
  ratio: number | null
}[] = [
  { id: 'square', label: 'Square', ratio: 1 },
  { id: '4:3', label: '4:3', ratio: 4 / 3 },
  { id: '3:2', label: '3:2', ratio: 3 / 2 },
  { id: '16:9', label: '16:9', ratio: 16 / 9 },
  { id: '9:16', label: '9:16', ratio: 9 / 16 },
  { id: 'banner', label: 'Banner', ratio: 4 },
  { id: 'custom', label: 'Custom', ratio: null },
]

export const MAX_MESH_POINTS = 8
export const MIN_MESH_POINTS = 2
