import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { SelectField } from '@/components/ui/SelectField'
import { Slider } from '@/components/ui/Slider'
import { TextField } from '@/components/ui/TextField'
import { canEncode } from '@/lib/browser/formats'
import { saveImageSettings } from '@/lib/storage/db'
import { formatBytes } from './geometry'
import { useImageStore } from './store'
import {
  FORMAT_LABELS,
  IMAGE_PRESETS,
  type CropMode,
  type ImageFormat,
  type ImagePreset,
} from './types'

export function ImageInspector() {
  const source = useImageStore((state) => state.source)
  const settings = useImageStore((state) => state.settings)
  const outputSize = useImageStore((state) => state.outputSize)
  const patch = useImageStore((state) => state.patch)
  const [supported, setSupported] = useState<Record<ImageFormat, boolean>>({
    'image/png': true,
    'image/jpeg': true,
    'image/webp': true,
    'image/avif': false,
  })

  useEffect(() => {
    void Promise.all(
      (Object.keys(FORMAT_LABELS) as ImageFormat[]).map(async (format) => [
        format,
        await canEncode(format),
      ]),
    ).then((entries) => {
      setSupported(Object.fromEntries(entries) as Record<ImageFormat, boolean>)
    })
  }, [])

  useEffect(() => {
    void saveImageSettings(settings)
  }, [settings])

  if (!source) {
    return <p className="text-sm text-mute">Drop an image to start.</p>
  }

  const applyPreset = (preset: ImagePreset) => {
    const item = IMAGE_PRESETS.find((entry) => entry.id === preset)
    if (!item) return
    if (item.scale) {
      patch({
        preset,
        width: Math.round(source.width * item.scale),
        height: Math.round(source.height * item.scale),
      })
      return
    }
    if (item.width && item.height) {
      patch({ preset, width: item.width, height: item.height, lockAspect: false })
      return
    }
    patch({ preset, width: source.width, height: source.height })
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-1 text-sm">
        <h2 className="text-ink">{source.name}</h2>
        <p className="text-mute">
          {source.width}×{source.height} · {formatBytes(source.size)}
          {source.isSvg ? ' · SVG will be rasterized on export' : ''}
        </p>
        <p className="text-mute">Processed locally. Nothing is uploaded.</p>
      </section>

      <SelectField
        id="preset"
        label="Output preset"
        value={settings.preset}
        onChange={(event) => applyPreset(event.target.value as ImagePreset)}
      >
        {IMAGE_PRESETS.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.label}
          </option>
        ))}
      </SelectField>

      <label className="flex min-h-10 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={settings.lockAspect}
          onChange={(event) => patch({ lockAspect: event.target.checked, preset: 'custom' })}
        />
        Lock aspect ratio
      </label>
      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="out-width"
          label="Width"
          inputMode="numeric"
          value={settings.width}
          onChange={(event) => {
            const width = Number(event.target.value) || 1
            const height = settings.lockAspect
              ? Math.round(width * (source.height / source.width))
              : settings.height
            patch({ width, height, preset: 'custom' })
          }}
        />
        <TextField
          id="out-height"
          label="Height"
          inputMode="numeric"
          value={settings.height}
          onChange={(event) => {
            const height = Number(event.target.value) || 1
            const width = settings.lockAspect
              ? Math.round(height * (source.width / source.height))
              : settings.width
            patch({ width, height, preset: 'custom' })
          }}
        />
      </div>

      <SegmentedControl
        label="Crop"
        value={settings.cropMode}
        onChange={(cropMode) => patch({ cropMode: cropMode as CropMode })}
        options={[
          { value: 'contain', label: 'Contain' },
          { value: 'cover', label: 'Cover' },
          { value: 'manual', label: 'Manual' },
        ]}
      />
      {settings.cropMode === 'manual' ? (
        <>
          <Slider
            label="Crop X"
            min={0}
            max={1}
            step={0.01}
            value={settings.crop.x}
            onChange={(x) => patch({ crop: { ...settings.crop, x } })}
            display={`${Math.round(settings.crop.x * 100)}%`}
          />
          <Slider
            label="Crop Y"
            min={0}
            max={1}
            step={0.01}
            value={settings.crop.y}
            onChange={(y) => patch({ crop: { ...settings.crop, y } })}
            display={`${Math.round(settings.crop.y * 100)}%`}
          />
          <Slider
            label="Crop width"
            min={0.05}
            max={1}
            step={0.01}
            value={settings.crop.width}
            onChange={(width) => patch({ crop: { ...settings.crop, width } })}
            display={`${Math.round(settings.crop.width * 100)}%`}
          />
          <Slider
            label="Crop height"
            min={0.05}
            max={1}
            step={0.01}
            value={settings.crop.height}
            onChange={(height) => patch({ crop: { ...settings.crop, height } })}
            display={`${Math.round(settings.crop.height * 100)}%`}
          />
        </>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() =>
            patch({ rotate: ((settings.rotate + 90) % 360) as 0 | 90 | 180 | 270 })
          }
        >
          Rotate 90°
        </Button>
        <Button onClick={() => patch({ flipH: !settings.flipH })}>Flip H</Button>
        <Button onClick={() => patch({ flipV: !settings.flipV })}>Flip V</Button>
      </div>

      <Slider
        label="Blur"
        min={0}
        max={40}
        value={settings.blur}
        onChange={(blur) => patch({ blur })}
        display={`${settings.blur}px`}
      />
      <Slider
        label="Opacity"
        min={0}
        max={1}
        step={0.01}
        value={settings.opacity}
        onChange={(opacity) => patch({ opacity })}
        display={`${Math.round(settings.opacity * 100)}%`}
      />
      <SelectField
        id="format"
        label="Format"
        value={settings.format}
        onChange={(event) => patch({ format: event.target.value as ImageFormat })}
      >
        {(Object.keys(FORMAT_LABELS) as ImageFormat[]).map((format) => (
          <option key={format} value={format} disabled={!supported[format]}>
            {FORMAT_LABELS[format]}
            {supported[format] ? '' : ' (unsupported here)'}
          </option>
        ))}
      </SelectField>
      {settings.format !== 'image/png' ? (
        <Slider
          label="Quality"
          min={0.1}
          max={1}
          step={0.01}
          value={settings.quality}
          onChange={(quality) => patch({ quality, targetBytes: null })}
          display={`${Math.round(settings.quality * 100)}%`}
        />
      ) : null}
      {settings.format === 'image/jpeg' ? (
        <TextField
          id="jpg-bg"
          label="Background for transparency"
          value={settings.background}
          onChange={(event) => patch({ background: event.target.value })}
        />
      ) : null}
      <TextField
        id="target-kb"
        label="Target file size (KB, optional)"
        inputMode="numeric"
        placeholder="Leave empty"
        value={settings.targetBytes ? String(Math.round(settings.targetBytes / 1024)) : ''}
        onChange={(event) => {
          const kb = Number(event.target.value)
          patch({ targetBytes: kb > 0 ? kb * 1024 : null })
        }}
      />
      <TextField
        id="filename"
        label="File name"
        value={settings.filename}
        onChange={(event) => patch({ filename: event.target.value })}
      />
      {outputSize !== null ? (
        <p className="text-sm text-mute">
          Output {formatBytes(outputSize)}
          {source.size
            ? ` · ${outputSize < source.size ? 'smaller' : 'larger'} than original ${formatBytes(source.size)}`
            : ''}
        </p>
      ) : null}
    </div>
  )
}
