import { uid } from '@/lib/color'
import type { ImageOps, WorkerRequest, WorkerResponse } from './types'

type Pending = {
  resolve: (value: { blob: Blob; width: number; height: number }) => void
  reject: (error: Error) => void
}

let worker: Worker | null = null
const pending = new Map<string, Pending>()

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('../../workers/image.worker.ts', import.meta.url), {
      type: 'module',
    })
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const job = pending.get(event.data.id)
      if (!job) return
      pending.delete(event.data.id)
      if (!event.data.ok || !event.data.buffer || !event.data.mime) {
        const error = new Error(event.data.error ?? 'Image processing failed')
        if (event.data.code) {
          Object.assign(error, { code: event.data.code })
        }
        job.reject(error)
        return
      }
      job.resolve({
        blob: new Blob([event.data.buffer], { type: event.data.mime }),
        width: event.data.width ?? 0,
        height: event.data.height ?? 0,
      })
    }
    worker.onerror = (event) => {
      for (const job of pending.values()) {
        job.reject(new Error(event.message || 'Image worker failed'))
      }
      pending.clear()
    }
  }
  return worker
}

export function processImage(
  fileBuffer: ArrayBuffer,
  mime: string,
  ops: ImageOps,
): Promise<{ blob: Blob; width: number; height: number }> {
  const id = uid('job')
  const request: WorkerRequest = { id, buffer: fileBuffer, mime, ops }
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
    getWorker().postMessage(request, [fileBuffer])
  })
}

export async function findQualityForTarget(
  makeBuffer: () => Promise<ArrayBuffer>,
  mime: string,
  ops: ImageOps,
  targetBytes: number,
): Promise<{ blob: Blob; width: number; height: number; quality: number }> {
  let low = 0.1
  let high = 1
  let best: { blob: Blob; width: number; height: number; quality: number } | null =
    null
  for (let i = 0; i < 7; i++) {
    const quality = (low + high) / 2
    const result = await processImage(await makeBuffer(), mime, { ...ops, quality })
    if (!best || Math.abs(result.blob.size - targetBytes) < Math.abs(best.blob.size - targetBytes)) {
      best = { ...result, quality }
    }
    if (result.blob.size > targetBytes) high = quality
    else low = quality
  }
  return best ?? { blob: new Blob(), width: 0, height: 0, quality: ops.quality }
}
