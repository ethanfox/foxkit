import { useEffect, useRef } from 'react'
import { DropZone } from '@/components/ui/DropZone'
import { toast } from '@/components/ui/Toast'
import { containSize, coverCrop, pixelCrop } from './geometry'
import { readImageFile } from './loadImage'
import { useImageStore } from './store'

export function ImagePreview() {
  const file = useImageStore((state) => state.file)
  const source = useImageStore((state) => state.source)
  const previewUrl = useImageStore((state) => state.previewUrl)
  const settings = useImageStore((state) => state.settings)
  const processing = useImageStore((state) => state.processing)
  const setFile = useImageStore((state) => state.setFile)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onFiles = async (files: FileList) => {
    const next = files[0]
    if (!next) return
    try {
      const loaded = await readImageFile(next)
      setFile(next, loaded.source, loaded.previewUrl)
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Could not open that file')
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !previewUrl || !source) return
    const image = new Image()
    image.onload = () => {
      canvas.width = settings.width
      canvas.height = settings.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.fillStyle = settings.background
      ctx.fillRect(0, 0, settings.width, settings.height)
      ctx.translate(settings.width / 2, settings.height / 2)
      ctx.rotate((settings.rotate * Math.PI) / 180)
      ctx.scale(settings.flipH ? -1 : 1, settings.flipV ? -1 : 1)
      const swapped = settings.rotate === 90 || settings.rotate === 270
      const frameW = swapped ? settings.height : settings.width
      const frameH = swapped ? settings.width : settings.height
      ctx.translate(-frameW / 2, -frameH / 2)
      if (settings.blur) ctx.filter = `blur(${settings.blur}px)`
      ctx.globalAlpha = settings.opacity
      if (settings.cropMode === 'contain') {
        const fit = containSize(image.naturalWidth, image.naturalHeight, frameW, frameH)
        ctx.drawImage(image, fit.x, fit.y, fit.drawW, fit.drawH)
      } else {
        const rect =
          settings.cropMode === 'cover'
            ? coverCrop(
                image.naturalWidth,
                image.naturalHeight,
                settings.width,
                settings.height,
              )
            : settings.crop
        const crop = pixelCrop(rect, image.naturalWidth, image.naturalHeight)
        ctx.drawImage(image, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, frameW, frameH)
      }
    }
    image.src = previewUrl
  }, [previewUrl, source, settings])

  if (!file || !source) {
    return (
      <DropZone
        label="Drop an image"
        accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml,.svg"
        hint="PNG, JPEG, WebP, AVIF, or SVG. Stays on this device."
        onFiles={(files) => void onFiles(files)}
      />
    )
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mute">
          Original {source.width}×{source.height}
          {processing ? ' · Working…' : ''}
        </p>
        <label className="cursor-pointer text-sm underline">
          Replace file
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml,.svg"
            className="sr-only"
            onChange={(event) => {
              if (event.target.files) void onFiles(event.target.files)
            }}
          />
        </label>
      </div>
      <div className="checkerboard overflow-hidden rounded-[var(--radius-card)] outline outline-white/10">
        <canvas ref={canvasRef} className="mx-auto max-h-[60vh] w-full object-contain" />
      </div>
    </div>
  )
}
