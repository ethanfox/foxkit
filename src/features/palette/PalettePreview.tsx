import { useRef, type PointerEvent } from 'react'
import { DropZone } from '@/components/ui/DropZone'
import { toast } from '@/components/ui/Toast'
import { readPaletteImage } from './load'
import { usePaletteStore } from './store'

export function PalettePreview() {
  const imageUrl = usePaletteStore((state) => state.imageUrl)
  const colors = usePaletteStore((state) => state.colors)
  const setImage = usePaletteStore((state) => state.setImage)
  const moveSwatch = usePaletteStore((state) => state.moveSwatch)
  const frameRef = useRef<HTMLDivElement>(null)

  const onFiles = async (files: FileList) => {
    const next = files[0]
    if (!next) return
    try {
      setImage(await readPaletteImage(next))
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Could not open that file')
    }
  }

  const onPointer = (event: PointerEvent<HTMLElement>) => {
    if (event.buttons !== 1 && event.type !== 'pointerdown') return
    const frame = frameRef.current
    if (!frame || colors.length === 0) return
    const rect = frame.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
    const targetId = event.currentTarget.dataset.swatchId
    if (targetId) {
      moveSwatch(targetId, x, y)
      return
    }
    const nearest = [...colors].sort((a, b) => {
      const da = (a.x - x) ** 2 + (a.y - y) ** 2
      const db = (b.x - x) ** 2 + (b.y - y) ** 2
      return da - db
    })[0]
    if (nearest) moveSwatch(nearest.id, x, y)
  }

  if (!imageUrl) {
    return (
      <div className="flex size-full items-center justify-center">
        <div className="w-full max-w-xl">
          <DropZone
            label="Drop an image"
            accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml,.svg"
            hint="PNG, JPEG, WebP, AVIF, or SVG. Colors are sampled on this device."
            onFiles={(files) => void onFiles(files)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex size-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 items-center justify-end">
        <label className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-[var(--radius-control)] bg-raised px-3.5 text-sm font-medium transition-[background-color,transform] duration-150 hover:bg-line active:scale-[0.96]">
          Replace
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
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto">
        <div
          ref={frameRef}
          className="relative max-h-full max-w-full overflow-hidden rounded-[var(--radius-card)] outline outline-1 outline-white/10"
          onPointerDown={onPointer}
          onPointerMove={onPointer}
        >
          <img
            src={imageUrl}
            alt=""
            className="block max-h-[min(70vh,100%)] max-w-full select-none"
            draggable={false}
          />
          {colors.map((color, index) => (
            <button
              key={color.id}
              type="button"
              data-swatch-id={color.id}
              aria-label={`Move color ${index + 1} ${color.hex}`}
              className="absolute size-10 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border-2 border-white shadow-[0_0_0_1px_black] active:cursor-grabbing"
              style={{
                left: `${color.x * 100}%`,
                top: `${color.y * 100}%`,
                background: color.hex,
              }}
              onPointerDown={(event) => {
                event.stopPropagation()
                event.currentTarget.setPointerCapture(event.pointerId)
                onPointer(event)
              }}
              onPointerMove={onPointer}
            />
          ))}
        </div>
      </div>
      {colors.length > 0 ? (
        <div className="flex h-14 shrink-0 overflow-hidden rounded-[var(--radius-control)]">
          {colors.map((color) => (
            <span
              key={color.id}
              className="min-w-0 flex-1"
              style={{ background: color.hex }}
              title={color.hex}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
