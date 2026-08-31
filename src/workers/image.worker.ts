import { containSize, pixelCrop } from '@/features/image/geometry'
import type { ImageOps, WorkerRequest, WorkerResponse } from '@/features/image/types'

function fail(id: string, error: string, code?: WorkerResponse['code']): WorkerResponse {
  return { id, ok: false, error, code }
}

async function decode(buffer: ArrayBuffer, mime: string): Promise<ImageBitmap> {
  const blob = new Blob([buffer], { type: mime || 'image/png' })
  return createImageBitmap(blob)
}

function drawSource(
  ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
  bitmap: ImageBitmap,
  ops: ImageOps,
) {
  const { outWidth, outHeight, rotate, flipH, flipV, blur, opacity, background } = ops
  ctx.save()
  ctx.fillStyle = background
  ctx.fillRect(0, 0, outWidth, outHeight)

  ctx.translate(outWidth / 2, outHeight / 2)
  ctx.rotate((rotate * Math.PI) / 180)
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)

  const swapped = rotate === 90 || rotate === 270
  const frameW = swapped ? outHeight : outWidth
  const frameH = swapped ? outWidth : outHeight
  ctx.translate(-frameW / 2, -frameH / 2)

  if (blur > 0) ctx.filter = `blur(${blur}px)`
  ctx.globalAlpha = opacity

  if (ops.cropMode === 'contain') {
    const fit = containSize(bitmap.width, bitmap.height, frameW, frameH)
    ctx.drawImage(bitmap, fit.x, fit.y, fit.drawW, fit.drawH)
  } else {
    const crop = pixelCrop(ops.crop, bitmap.width, bitmap.height)
    ctx.drawImage(bitmap, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, frameW, frameH)
  }
  ctx.restore()
}

async function encode(
  canvas: OffscreenCanvas,
  ops: ImageOps,
): Promise<{ buffer: ArrayBuffer; mime: string }> {
  try {
    const blob = await canvas.convertToBlob({
      type: ops.format,
      quality: ops.quality,
    })
    if (!blob || (ops.format !== 'image/png' && blob.type && blob.type !== ops.format)) {
      throw new Error('unsupported')
    }
    return { buffer: await blob.arrayBuffer(), mime: blob.type || ops.format }
  } catch {
    throw Object.assign(new Error('This browser cannot encode that format.'), {
      code: 'unsupported-format' as const,
    })
  }
}

async function process(request: WorkerRequest): Promise<WorkerResponse> {
  const { id, buffer, mime, ops } = request
  let bitmap: ImageBitmap | null = null
  try {
    bitmap = await decode(buffer, mime)
    const canvas = new OffscreenCanvas(ops.outWidth, ops.outHeight)
    const ctx = canvas.getContext('2d')
    if (!ctx) return fail(id, 'OffscreenCanvas is unavailable')
    drawSource(ctx, bitmap, ops)
    const encoded = await encode(canvas, ops)
    return {
      id,
      ok: true,
      buffer: encoded.buffer,
      mime: encoded.mime,
      width: ops.outWidth,
      height: ops.outHeight,
    }
  } catch (error) {
    const code =
      error && typeof error === 'object' && 'code' in error
        ? (error as { code?: WorkerResponse['code'] }).code
        : undefined
    return fail(
      id,
      error instanceof Error ? error.message : 'Could not process image',
      code,
    )
  } finally {
    bitmap?.close()
  }
}

const worker = self as unknown as {
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null
  postMessage: (message: WorkerResponse, transfer?: Transferable[]) => void
}

worker.onmessage = (event: MessageEvent<WorkerRequest>) => {
  void process(event.data).then((response) => {
    if (response.ok && response.buffer) {
      worker.postMessage(response, [response.buffer])
    } else {
      worker.postMessage(response)
    }
  })
}
