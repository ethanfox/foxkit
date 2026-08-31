export type ImageFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/avif'
export type CropMode = 'contain' | 'cover' | 'manual'
export type ImagePreset =
  | 'original'
  | '1x'
  | '2x'
  | '3x'
  | 'hero'
  | 'social-square'
  | 'social-landscape'
  | 'portrait'
  | 'custom'

export interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageSettings {
  lockAspect: boolean
  width: number
  height: number
  cropMode: CropMode
  crop: CropRect
  rotate: 0 | 90 | 180 | 270
  flipH: boolean
  flipV: boolean
  blur: number
  opacity: number
  format: ImageFormat
  quality: number
  background: string
  filename: string
  preset: ImagePreset
  targetBytes: number | null
}

export interface ImageSource {
  name: string
  type: string
  size: number
  width: number
  height: number
  isSvg: boolean
}

export interface ImageOps {
  crop: CropRect
  outWidth: number
  outHeight: number
  rotate: 0 | 90 | 180 | 270
  flipH: boolean
  flipV: boolean
  blur: number
  opacity: number
  format: ImageFormat
  quality: number
  background: string
  cropMode: CropMode
  sourceWidth: number
  sourceHeight: number
}

export interface WorkerRequest {
  id: string
  buffer: ArrayBuffer
  mime: string
  ops: ImageOps
}

export interface WorkerResponse {
  id: string
  ok: boolean
  buffer?: ArrayBuffer
  mime?: string
  width?: number
  height?: number
  error?: string
  code?: 'unsupported-format'
}

export const FORMAT_LABELS: Record<ImageFormat, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'image/webp': 'WebP',
  'image/avif': 'AVIF',
}

export const IMAGE_PRESETS: {
  id: ImagePreset
  label: string
  width?: number
  height?: number
  scale?: number
}[] = [
  { id: 'original', label: 'Original' },
  { id: '1x', label: '1x', scale: 1 },
  { id: '2x', label: '2x', scale: 2 },
  { id: '3x', label: '3x', scale: 3 },
  { id: 'hero', label: 'Web hero', width: 1920, height: 1080 },
  { id: 'social-square', label: 'Social square', width: 1080, height: 1080 },
  { id: 'social-landscape', label: 'Social landscape', width: 1200, height: 630 },
  { id: 'portrait', label: 'Portrait', width: 1080, height: 1350 },
  { id: 'custom', label: 'Custom' },
]

export function defaultImageSettings(
  width = 1080,
  height = 1080,
): ImageSettings {
  return {
    lockAspect: true,
    width,
    height,
    cropMode: 'cover',
    crop: { x: 0, y: 0, width: 1, height: 1 },
    rotate: 0,
    flipH: false,
    flipV: false,
    blur: 0,
    opacity: 1,
    format: 'image/webp',
    quality: 0.82,
    background: '#000000',
    filename: 'foxkit-image',
    preset: 'original',
    targetBytes: null,
  }
}

export function extensionFor(format: ImageFormat): string {
  if (format === 'image/jpeg') return 'jpg'
  if (format === 'image/webp') return 'webp'
  if (format === 'image/avif') return 'avif'
  return 'png'
}
