import { clamp, colorCss, hexToRgb } from '@/lib/color'
import { sortedStops } from './css'
import type { ColorStop, GradientDocument, MeshPoint } from './types'

export function linearEndpoints(
  angleDeg: number,
  width: number,
  height: number,
): { x0: number; y0: number; x1: number; y1: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  const cx = width / 2
  const cy = height / 2
  const length = Math.abs(width * Math.cos(rad)) + Math.abs(height * Math.sin(rad))
  const dx = Math.cos(rad) * (length / 2)
  const dy = Math.sin(rad) * (length / 2)
  return { x0: cx - dx, y0: cy - dy, x1: cx + dx, y1: cy + dy }
}

function applyStops(
  gradient: CanvasGradient,
  stops: ColorStop[],
) {
  for (const stop of sortedStops(stops)) {
    gradient.addColorStop(
      clamp(stop.position / 100, 0, 1),
      colorCss(stop.hex, stop.alpha),
    )
  }
}

export function paintCssGradient(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  doc: GradientDocument,
  width: number,
  height: number,
) {
  if (doc.canvasBackground === 'solid') {
    ctx.fillStyle = doc.solidColor
    ctx.fillRect(0, 0, width, height)
  } else {
    ctx.clearRect(0, 0, width, height)
  }

  let gradient: CanvasGradient
  if (doc.type === 'linear') {
    const { x0, y0, x1, y1 } = linearEndpoints(doc.angle, width, height)
    gradient = ctx.createLinearGradient(x0, y0, x1, y1)
  } else if (doc.type === 'radial') {
    const x = (doc.radialPosition.x / 100) * width
    const y = (doc.radialPosition.y / 100) * height
    gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(width, height) / 2)
  } else {
    const x = width / 2
    const y = height / 2
    gradient = ctx.createConicGradient((doc.conicAngle * Math.PI) / 180, x, y)
  }
  applyStops(gradient, doc.stops)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

export function paintMesh(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  points: MeshPoint[],
  width: number,
  height: number,
  background: { mode: 'transparent' | 'solid'; color: string },
) {
  if (background.mode === 'solid') {
    ctx.fillStyle = background.color
    ctx.fillRect(0, 0, width, height)
  } else {
    ctx.clearRect(0, 0, width, height)
  }

  const image = ctx.createImageData(width, height)
  const data = image.data
  const prepared = points.map((point) => {
    const [r, g, b] = hexToRgb(point.hex)
    return {
      r,
      g,
      b,
      a: clamp(point.alpha, 0, 1),
      x: point.x * width,
      y: point.y * height,
      radius: Math.max(8, point.radius * Math.max(width, height)),
    }
  })

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let tw = 0
      let r = 0
      let g = 0
      let b = 0
      let a = 0
      for (const point of prepared) {
        const dx = x - point.x
        const dy = y - point.y
        const dist2 = dx * dx + dy * dy
        const influence = point.radius * point.radius
        const weight = 1 / (dist2 / (influence + 1e-4) + 1e-4)
        r += point.r * weight
        g += point.g * weight
        b += point.b * weight
        a += point.a * weight
        tw += weight
      }
      const i = (y * width + x) * 4
      data[i] = r / tw
      data[i + 1] = g / tw
      data[i + 2] = b / tw
      data[i + 3] = (a / tw) * 255
    }
  }
  ctx.putImageData(image, 0, 0)
}

export function paintGradient(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  doc: GradientDocument,
  width: number,
  height: number,
) {
  if (doc.type === 'freeform') {
    paintMesh(ctx, doc.points, width, height, {
      mode: doc.canvasBackground,
      color: doc.solidColor,
    })
    return
  }
  paintCssGradient(ctx, doc, width, height)
}

export function gradientSvgMarkup(
  doc: GradientDocument,
  width: number,
  height: number,
): string {
  if (doc.type === 'freeform') {
    return meshSvgMarkup(doc, width, height)
  }

  const stops = sortedStops(doc.stops)
    .map((stop) => {
      const [r, g, b] = hexToRgb(stop.hex)
      return `<stop offset="${stop.position}%" stop-color="rgb(${r},${g},${b})" stop-opacity="${clamp(stop.alpha, 0, 1)}" />`
    })
    .join('')

  let def: string
  if (doc.type === 'linear') {
    const { x0, y0, x1, y1 } = linearEndpoints(doc.angle, width, height)
    def = `<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}">${stops}</linearGradient>`
  } else if (doc.type === 'radial') {
    const x = (doc.radialPosition.x / 100) * width
    const y = (doc.radialPosition.y / 100) * height
    def = `<radialGradient id="g" cx="${x}" cy="${y}" r="${Math.max(width, height) / 2}" gradientUnits="userSpaceOnUse">${stops}</radialGradient>`
  } else {
    def = `<linearGradient id="g" x1="0" y1="0" x2="1" y2="0">${stops}</linearGradient>`
  }

  const bg =
    doc.canvasBackground === 'solid'
      ? `<rect width="100%" height="100%" fill="${doc.solidColor}" />`
      : ''

  const body =
    doc.type === 'conic'
      ? `<foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;background:${cssFallback(doc)}"></div></foreignObject>`
      : `${bg}<rect width="100%" height="100%" fill="url(#g)" />`

  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n  <defs>${def}</defs>\n  ${body}\n</svg>`
}

function cssFallback(doc: GradientDocument): string {
  const stops = sortedStops(doc.stops)
    .map((stop) => `${colorCss(stop.hex, stop.alpha)} ${stop.position}%`)
    .join(', ')
  return `conic-gradient(from ${doc.conicAngle}deg at 50% 50%, ${stops})`
}

function meshSvgMarkup(doc: GradientDocument, width: number, height: number): string {
  const defs = doc.points
    .map((point, index) => {
      const [r, g, b] = hexToRgb(point.hex)
      return `<radialGradient id="p${index}" cx="${point.x}" cy="${point.y}" r="${point.radius}" gradientUnits="objectBoundingBox"><stop offset="0%" stop-color="rgb(${r},${g},${b})" stop-opacity="${point.alpha}" /><stop offset="100%" stop-color="rgb(${r},${g},${b})" stop-opacity="0" /></radialGradient>`
    })
    .join('')

  const rects = doc.points
    .map((_, index) => `<rect width="100%" height="100%" fill="url(#p${index})" />`)
    .join('')

  const bg =
    doc.canvasBackground === 'solid'
      ? `<rect width="100%" height="100%" fill="${doc.solidColor}" />`
      : ''

  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n  <defs>${defs}</defs>\n  ${bg}${rects}\n</svg>`
}

export async function exportGradientPng(
  doc: GradientDocument,
  width: number,
  height: number,
  type: 'image/png' | 'image/jpeg' = 'image/png',
  quality = 0.92,
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is unavailable')
  if (type === 'image/jpeg' && doc.canvasBackground === 'transparent') {
    ctx.fillStyle = doc.solidColor || '#000000'
    ctx.fillRect(0, 0, width, height)
  }
  paintGradient(ctx, doc, width, height)
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, quality),
  )
  if (!blob) throw new Error('Could not encode image')
  return blob
}
