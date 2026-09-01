import { useState } from 'react'
import { DropZone } from '@/components/ui/DropZone'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { toast } from '@/components/ui/Toast'
import { formatBytes } from './geometry'
import { readImageFile } from './loadImage'
import { useImageStore } from './store'
import { FORMAT_LABELS } from './types'

export function ImagePreview() {
  const file = useImageStore((state) => state.file)
  const source = useImageStore((state) => state.source)
  const previewUrl = useImageStore((state) => state.previewUrl)
  const settings = useImageStore((state) => state.settings)
  const output = useImageStore((state) => state.output)
  const processing = useImageStore((state) => state.processing)
  const setFile = useImageStore((state) => state.setFile)
  const [view, setView] = useState<'original' | 'output'>('output')

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

  if (!file || !source || !previewUrl) {
    return (
      <div className="flex size-full items-center justify-center">
        <div className="w-full max-w-xl">
          <DropZone
            label="Drop an image"
            accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml,.svg"
            hint="PNG, JPEG, WebP, AVIF, or SVG. Stays on this device."
            onFiles={(files) => void onFiles(files)}
          />
        </div>
      </div>
    )
  }

  const showOriginal = view === 'original' || !output
  const src = showOriginal ? previewUrl : output.url

  return (
    <div className="flex size-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="font-mono text-sm text-ink tabular-nums">
          {showOriginal
            ? `${source.width}×${source.height} · ${formatBytes(source.size)}`
            : output
              ? `${output.width}×${output.height} · ${formatBytes(output.blob.size)} · ${FORMAT_LABELS[settings.format]}`
              : processing
                ? 'Working…'
                : 'Waiting'}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-52">
            <SegmentedControl
              label="Preview"
              hideLabel
              value={output ? view : 'original'}
              onChange={(value) => setView(value as 'original' | 'output')}
              options={[
                { value: 'original', label: 'Original' },
                { value: 'output', label: 'Output', disabled: !output },
              ]}
            />
          </div>
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
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto">
        <div className="checkerboard max-h-full max-w-full overflow-hidden rounded-[var(--radius-card)] outline outline-white/10">
          <img
            src={src}
            alt={showOriginal ? 'Original image' : 'Output preview'}
            className="block max-h-full max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  )
}
