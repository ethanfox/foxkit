import { canDecodeType } from '@/lib/browser/formats'
import type { PixelBuffer } from './types'

const SAMPLE = 200

export async function readPaletteImage(file: File): Promise<{
  url: string
  width: number
  height: number
  name: string
  pixels: PixelBuffer
}> {
  if (!canDecodeType(file.type) && !file.name.toLowerCase().endsWith('.svg')) {
    throw new Error('Use PNG, JPEG, WebP, AVIF, or SVG.')
  }
  const url = URL.createObjectURL(file)
  try {
    const image = await decodeImage(url)
    return {
      url,
      width: image.naturalWidth || image.width,
      height: image.naturalHeight || image.height,
      name: file.name.replace(/\.[^.]+$/, '') || 'Untitled palette',
      pixels: rasterize(image, SAMPLE),
    }
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }
}

function decodeImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not read that image.'))
    image.src = url
  })
}

function rasterize(image: HTMLImageElement, max: number): PixelBuffer {
  const width = image.naturalWidth || image.width
  const height = image.naturalHeight || image.height
  const scale = Math.min(1, max / Math.max(width, height, 1))
  const w = Math.max(1, Math.round(width * scale))
  const h = Math.max(1, Math.round(height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas is unavailable')
  ctx.drawImage(image, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h)
  return { data, width: w, height: h }
}
