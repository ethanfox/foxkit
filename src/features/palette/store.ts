import { create } from 'zustand'
import { DEFAULT_COLORS } from './types'
import type { PaletteSwatch, PixelBuffer } from './types'
import { extractPalette, sampleColor } from './extract'

interface PaletteStore {
  name: string
  count: number
  colors: PaletteSwatch[]
  imageUrl: string | null
  imageWidth: number
  imageHeight: number
  pixels: PixelBuffer | null
  setImage: (input: {
    url: string
    width: number
    height: number
    name: string
    pixels: PixelBuffer
  }) => void
  setCount: (count: number) => void
  setName: (name: string) => void
  moveSwatch: (id: string, x: number, y: number) => void
  setColors: (colors: PaletteSwatch[], name?: string) => void
  clear: () => void
}

function revoke(url: string | null) {
  if (url) URL.revokeObjectURL(url)
}

export const usePaletteStore = create<PaletteStore>((set, get) => ({
  name: 'Untitled palette',
  count: DEFAULT_COLORS,
  colors: [],
  imageUrl: null,
  imageWidth: 0,
  imageHeight: 0,
  pixels: null,
  setImage: (input) => {
    revoke(get().imageUrl)
    const colors = extractPalette(input.pixels, get().count)
    set({
      imageUrl: input.url,
      imageWidth: input.width,
      imageHeight: input.height,
      pixels: input.pixels,
      name: input.name,
      colors,
    })
  },
  setCount: (count) => {
    const { pixels } = get()
    set({
      count,
      colors: pixels ? extractPalette(pixels, count) : get().colors,
    })
  },
  setName: (name) => set({ name }),
  moveSwatch: (id, x, y) => {
    const { pixels, colors } = get()
    if (!pixels) return
    set({
      colors: colors.map((color) =>
        color.id === id
          ? { ...color, x, y, hex: sampleColor(pixels, x, y) }
          : color,
      ),
    })
  },
  setColors: (colors, name) =>
    set({
      colors,
      count: colors.length,
      ...(name ? { name } : {}),
    }),
  clear: () => {
    revoke(get().imageUrl)
    set({
      name: 'Untitled palette',
      count: DEFAULT_COLORS,
      colors: [],
      imageUrl: null,
      imageWidth: 0,
      imageHeight: 0,
      pixels: null,
    })
  },
}))
