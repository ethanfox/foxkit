import type { ImageFormat } from '@/features/image/types'

const cache = new Map<string, boolean>()

export async function canEncode(type: ImageFormat): Promise<boolean> {
  const hit = cache.get(type)
  if (hit !== undefined) return hit
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const supported = await new Promise<boolean>((resolve) => {
    canvas.toBlob((blob) => resolve(Boolean(blob && blob.type === type)), type, 0.8)
  })
  cache.set(type, supported)
  return supported
}

export function canDecodeType(type: string): boolean {
  return [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/avif',
    'image/svg+xml',
  ].includes(type)
}
