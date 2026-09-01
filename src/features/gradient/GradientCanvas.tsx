import { useEffect, useRef, type PointerEvent } from 'react'
import { paintGradient } from './render'
import { useGradientStore } from './store'

export function GradientCanvas() {
  const doc = useGradientStore((state) => state.doc)
  const updateStop = useGradientStore((state) => state.updateStop)
  const updatePoint = useGradientStore((state) => state.updatePoint)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const ratio = doc.width / doc.height

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const width = Math.max(2, Math.round(rect.width))
    const height = Math.max(2, Math.round(rect.height))
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    paintGradient(ctx, doc, width, height)
  }, [doc])

  const onPointer = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.buttons !== 1 && event.type !== 'pointerdown') return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    if (doc.type === 'freeform') {
      const nearest = [...doc.points].sort((a, b) => {
        const da = (a.x - x) ** 2 + (a.y - y) ** 2
        const db = (b.x - x) ** 2 + (b.y - y) ** 2
        return da - db
      })[0]
      if (nearest) updatePoint(nearest.id, { x, y })
      return
    }
    const nearest = [...doc.stops].sort(
      (a, b) => Math.abs(a.position / 100 - x) - Math.abs(b.position / 100 - x),
    )[0]
    if (nearest) updateStop(nearest.id, { position: x * 100 })
  }

  return (
    <div className="flex size-full items-center justify-center">
      <div
        className={`relative max-h-full w-full max-w-3xl ${doc.showGrid ? 'checkerboard' : 'bg-raised'} overflow-hidden rounded-[var(--radius-card)] outline outline-white/10`}
        style={{ aspectRatio: `${ratio}` }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
          onPointerDown={onPointer}
          onPointerMove={onPointer}
        />
        {doc.type === 'freeform'
          ? doc.points.map((point) => (
              <span
                key={point.id}
                className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_black]"
                style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
              />
            ))
          : doc.stops.map((stop) => (
              <span
                key={stop.id}
                className="pointer-events-none absolute bottom-3 size-4 -translate-x-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_black]"
                style={{
                  left: `${stop.position}%`,
                  background: stop.hex,
                }}
              />
            ))}
      </div>
    </div>
  )
}
