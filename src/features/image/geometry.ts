import { clamp } from '@/lib/color'
import type { CropRect } from './types'

export function coverCrop(
  sourceW: number,
  sourceH: number,
  outW: number,
  outH: number,
): CropRect {
  const sourceRatio = sourceW / sourceH
  const outRatio = outW / outH
  if (sourceRatio > outRatio) {
    const width = outRatio / sourceRatio
    return { x: (1 - width) / 2, y: 0, width, height: 1 }
  }
  const height = sourceRatio / outRatio
  return { x: 0, y: (1 - height) / 2, width: 1, height }
}

export function containSize(
  sourceW: number,
  sourceH: number,
  outW: number,
  outH: number,
): { drawW: number; drawH: number; x: number; y: number } {
  const scale = Math.min(outW / sourceW, outH / sourceH)
  const drawW = sourceW * scale
  const drawH = sourceH * scale
  return {
    drawW,
    drawH,
    x: (outW - drawW) / 2,
    y: (outH - drawH) / 2,
  }
}

export function pixelCrop(
  crop: CropRect,
  sourceW: number,
  sourceH: number,
): { sx: number; sy: number; sw: number; sh: number } {
  const sx = clamp(crop.x, 0, 1) * sourceW
  const sy = clamp(crop.y, 0, 1) * sourceH
  const sw = clamp(crop.width, 0.01, 1) * sourceW
  const sh = clamp(crop.height, 0.01, 1) * sourceH
  return {
    sx,
    sy,
    sw: Math.min(sw, sourceW - sx),
    sh: Math.min(sh, sourceH - sy),
  }
}

export function swappedSize(
  width: number,
  height: number,
  rotate: number,
): { width: number; height: number } {
  if (rotate === 90 || rotate === 270) return { width: height, height: width }
  return { width, height }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
