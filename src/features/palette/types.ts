export const MIN_COLORS = 2
export const MAX_COLORS = 12
export const DEFAULT_COLORS = 6

export interface PaletteSwatch {
  id: string
  hex: string
  x: number
  y: number
}

export interface PixelBuffer {
  data: Uint8ClampedArray
  width: number
  height: number
}

export interface SavedPalette {
  id: string
  name: string
  colors: PaletteSwatch[]
  savedAt: number
}

export interface PaletteDocument {
  name: string
  count: number
  colors: PaletteSwatch[]
}
