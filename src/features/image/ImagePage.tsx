import { useEffect, useRef } from 'react'
import { ExportBar } from '@/components/export/ExportBar'
import { toast } from '@/components/ui/Toast'
import { Workspace } from '@/components/workspace/Workspace'
import { downloadBlob, sanitizeFilename } from '@/lib/download'
import { loadImageSettings } from '@/lib/storage/db'
import { formatBytes } from './geometry'
import { ImageInspector } from './ImageInspector'
import { ImagePreview } from './ImagePreview'
import { settingsToOps } from './ops'
import { useImageStore } from './store'
import { extensionFor } from './types'
import { findQualityForTarget, processImage } from './workerClient'

export function ImagePage() {
  const file = useImageStore((state) => state.file)
  const source = useImageStore((state) => state.source)
  const settings = useImageStore((state) => state.settings)
  const outputSize = useImageStore((state) => state.outputSize)
  const processing = useImageStore((state) => state.processing)
  const error = useImageStore((state) => state.error)
  const patch = useImageStore((state) => state.patch)
  const setOutputSize = useImageStore((state) => state.setOutputSize)
  const setProcessing = useImageStore((state) => state.setProcessing)
  const setError = useImageStore((state) => state.setError)
  const estimateRef = useRef(0)

  useEffect(() => {
    void loadImageSettings().then((saved) => {
      if (saved) patch(saved)
    })
  }, [patch])

  useEffect(() => {
    if (!file || !source) return
    const ticket = ++estimateRef.current
    const timer = window.setTimeout(() => {
      void (async () => {
        setProcessing(true)
        try {
          const buffer = await file.arrayBuffer()
          const ops = settingsToOps(settings, source)
          const result = settings.targetBytes
            ? await findQualityForTarget(
                () => file.arrayBuffer(),
                source.type,
                ops,
                settings.targetBytes,
              )
            : await processImage(buffer, source.type, ops)
          if (ticket !== estimateRef.current) return
          setOutputSize(result.blob.size)
          setError(null)
        } catch (caught) {
          if (ticket !== estimateRef.current) return
          const message =
            caught instanceof Error ? caught.message : 'Could not process image'
          setError(message)
          setOutputSize(null)
        } finally {
          if (ticket === estimateRef.current) setProcessing(false)
        }
      })()
    }, 280)
    return () => window.clearTimeout(timer)
  }, [file, source, settings, patch, setError, setOutputSize, setProcessing])

  const download = async () => {
    if (!file || !source) {
      toast('Drop an image first')
      return
    }
    setProcessing(true)
    try {
      const ops = settingsToOps(settings, source)
      const result = settings.targetBytes
        ? await findQualityForTarget(
            () => file.arrayBuffer(),
            source.type,
            ops,
            settings.targetBytes,
          )
        : await processImage(await file.arrayBuffer(), source.type, ops)
      const name = `${sanitizeFilename(settings.filename, 'foxkit-image')}.${extensionFor(settings.format)}`
      downloadBlob(result.blob, name)
      setOutputSize(result.blob.size)
      toast('Downloaded. Processed on this device.')
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : 'Could not export image'
      setError(message)
      toast(message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Workspace
      nav={
        <div className="grid gap-3 text-sm text-mute">
          <p>Image Lab</p>
          <p>Resize, crop, blur, convert, and compress without leaving this browser.</p>
          <p>Large work runs in a worker so the UI stays usable.</p>
        </div>
      }
      preview={<ImagePreview />}
      inspector={<ImageInspector />}
      exportBar={
        <ExportBar
          onDownload={() => void download()}
          downloadLabel={processing ? 'Working…' : 'Download'}
          disabled={!file || processing}
        >
          {error
            ? error
            : file
              ? `${settings.width}×${settings.height}${
                  outputSize ? ` · ${formatBytes(outputSize)}` : ''
                } · local`
              : 'No file yet'}
        </ExportBar>
      }
    />
  )
}
