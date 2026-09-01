import { clamp, rgbToHex, rgbToHsl, uid } from '@/lib/color'
import {
  DEFAULT_COLORS,
  MAX_COLORS,
  MIN_COLORS,
  type PaletteSwatch,
  type PixelBuffer,
} from './types'

interface Pixel {
  r: number
  g: number
  b: number
  x: number
  y: number
}

function pixelsFrom(buffer: PixelBuffer): Pixel[] {
  const { data, width, height } = buffer
  const step = Math.max(1, Math.floor(Math.sqrt((width * height) / 4000)))
  const pixels: Pixel[] = []
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4
      if (data[i + 3] < 16) continue
      pixels.push({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        x: width <= 1 ? 0.5 : x / (width - 1),
        y: height <= 1 ? 0.5 : y / (height - 1),
      })
    }
  }
  return pixels
}

function dist2(a: Pick<Pixel, 'r' | 'g' | 'b'>, b: Pick<Pixel, 'r' | 'g' | 'b'>) {
  const dr = a.r - b.r
  const dg = a.g - b.g
  const db = a.b - b.b
  return dr * dr + dg * dg + db * db
}

export function sampleColor(buffer: PixelBuffer, x: number, y: number): string {
  const px = clamp(Math.round(x * (buffer.width - 1)), 0, Math.max(0, buffer.width - 1))
  const py = clamp(Math.round(y * (buffer.height - 1)), 0, Math.max(0, buffer.height - 1))
  const i = (py * buffer.width + px) * 4
  return rgbToHex(buffer.data[i], buffer.data[i + 1], buffer.data[i + 2])
}

export function extractPalette(
  buffer: PixelBuffer,
  count = DEFAULT_COLORS,
): PaletteSwatch[] {
  const k = clamp(Math.round(count), MIN_COLORS, MAX_COLORS)
  const pixels = pixelsFrom(buffer)
  if (pixels.length === 0) {
    return Array.from({ length: k }, (_, index) => ({
      id: uid('swatch'),
      hex: '#000000',
      x: (index + 1) / (k + 1),
      y: 0.5,
    }))
  }

  const unique = new Map<string, Pixel>()
  for (const pixel of pixels) {
    unique.set(rgbToHex(pixel.r, pixel.g, pixel.b), pixel)
  }
  if (unique.size <= k) {
    return [...unique.values()]
      .slice(0, k)
      .map((pixel) => toSwatch(pixel))
      .sort(byHue)
  }

  const centroids = evenlySpaced(pixels, k)
  const assign = new Array<number>(pixels.length).fill(0)

  for (let iter = 0; iter < 12; iter++) {
    for (let i = 0; i < pixels.length; i++) {
      let best = 0
      let bestDist = Infinity
      for (let c = 0; c < centroids.length; c++) {
        const d = dist2(pixels[i], centroids[c])
        if (d < bestDist) {
          bestDist = d
          best = c
        }
      }
      assign[i] = best
    }

    const next = centroids.map(() => ({ r: 0, g: 0, b: 0, x: 0, y: 0, n: 0 }))
    for (let i = 0; i < pixels.length; i++) {
      const bucket = next[assign[i]]
      const pixel = pixels[i]
      bucket.r += pixel.r
      bucket.g += pixel.g
      bucket.b += pixel.b
      bucket.x += pixel.x
      bucket.y += pixel.y
      bucket.n += 1
    }
    for (let c = 0; c < centroids.length; c++) {
      if (next[c].n === 0) {
        centroids[c] = pixels[(c * 97) % pixels.length]
        continue
      }
      const n = next[c].n
      centroids[c] = {
        r: next[c].r / n,
        g: next[c].g / n,
        b: next[c].b / n,
        x: next[c].x / n,
        y: next[c].y / n,
      }
    }
  }

  return centroids.map((centroid) => toSwatch(centroid)).sort(byHue)
}

function evenlySpaced(pixels: Pixel[], k: number): Pixel[] {
  const out: Pixel[] = []
  const gap = (pixels.length - 1) / Math.max(1, k - 1)
  for (let i = 0; i < k; i++) {
    out.push(pixels[Math.round(i * gap)])
  }
  return out
}

function toSwatch(pixel: Pixel): PaletteSwatch {
  return {
    id: uid('swatch'),
    hex: rgbToHex(pixel.r, pixel.g, pixel.b),
    x: clamp(pixel.x, 0, 1),
    y: clamp(pixel.y, 0, 1),
  }
}

function byHue(a: PaletteSwatch, b: PaletteSwatch) {
  return rgbToHsl(...hexToTuple(a.hex))[0] - rgbToHsl(...hexToTuple(b.hex))[0]
}

function hexToTuple(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function paletteHexList(colors: PaletteSwatch[]): string {
  return colors.map((color) => color.hex).join('\n')
}

export function paletteCss(colors: PaletteSwatch[]): string {
  const lines = colors.map((color, index) => `  --color-${index + 1}: ${color.hex};`)
  return `:root {\n${lines.join('\n')}\n}`
}

export function paletteJson(name: string, colors: PaletteSwatch[]): string {
  return JSON.stringify(
    {
      name,
      colors: colors.map(({ hex, x, y }) => ({ hex, x, y })),
    },
    null,
    2,
  )
}
