import { coverCrop } from './geometry'
import type { ImageOps, ImageSettings, ImageSource } from './types'

export function settingsToOps(settings: ImageSettings, source: ImageSource): ImageOps {
  const crop =
    settings.cropMode === 'cover'
      ? coverCrop(source.width, source.height, settings.width, settings.height)
      : settings.cropMode === 'contain'
        ? { x: 0, y: 0, width: 1, height: 1 }
        : settings.crop

  return {
    crop,
    outWidth: Math.max(1, Math.round(settings.width)),
    outHeight: Math.max(1, Math.round(settings.height)),
    rotate: settings.rotate,
    flipH: settings.flipH,
    flipV: settings.flipV,
    blur: settings.blur,
    opacity: settings.opacity,
    format: settings.format,
    quality: settings.quality,
    background: settings.background,
    cropMode: settings.cropMode,
    sourceWidth: source.width,
    sourceHeight: source.height,
  }
}
