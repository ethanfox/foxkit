import { useMemo, useState } from 'react'
import { hexToRgb, hslToRgb, normalizeHex, rgbToHex, rgbToHsl } from '@/lib/color'
import { SegmentedControl } from './SegmentedControl'
import { Slider } from './Slider'
import { TextField } from './TextField'

type Mode = 'hex' | 'rgb' | 'hsl'

interface ColorInputProps {
  label: string
  hex: string
  alpha: number
  onChange: (hex: string, alpha: number) => void
}

export function ColorInput({ label, hex, alpha, onChange }: ColorInputProps) {
  const [mode, setMode] = useState<Mode>('hex')
  const [r, g, b] = hexToRgb(hex)
  const [h, s, l] = useMemo(() => rgbToHsl(r, g, b), [r, g, b])
  const baseId = label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="grid gap-3 rounded-[var(--radius-control)] border border-line p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink">{label}</p>
        <input
          type="color"
          aria-label={`${label} swatch`}
          value={normalizeHex(hex) ?? '#000000'}
          onChange={(event) => onChange(event.target.value, alpha)}
          className="h-10 w-10 cursor-pointer rounded-md border border-line bg-transparent p-0"
        />
      </div>
      <SegmentedControl
        label="Color format"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'hex', label: 'HEX' },
          { value: 'rgb', label: 'RGB' },
          { value: 'hsl', label: 'HSL' },
        ]}
      />
      {mode === 'hex' ? (
        <TextField
          id={`${baseId}-hex`}
          label="Hex"
          value={hex}
          spellCheck={false}
          onChange={(event) => {
            const next = normalizeHex(event.target.value)
            if (next) onChange(next, alpha)
          }}
        />
      ) : null}
      {mode === 'rgb' ? (
        <div className="grid grid-cols-3 gap-2">
          {(['R', 'G', 'B'] as const).map((channel, index) => {
            const value = [r, g, b][index]
            return (
              <TextField
                key={channel}
                id={`${baseId}-${channel}`}
                label={channel}
                inputMode="numeric"
                value={value}
                onChange={(event) => {
                  const next = Number(event.target.value)
                  if (Number.isNaN(next)) return
                  const rgb: [number, number, number] = [r, g, b]
                  rgb[index] = next
                  onChange(rgbToHex(...rgb), alpha)
                }}
              />
            )
          })}
        </div>
      ) : null}
      {mode === 'hsl' ? (
        <div className="grid gap-2">
          <Slider
            label="Hue"
            min={0}
            max={360}
            value={Math.round(h)}
            onChange={(value) => onChange(rgbToHex(...hslToRgb(value, s, l)), alpha)}
            display={`${Math.round(h)}°`}
          />
          <Slider
            label="Saturation"
            min={0}
            max={100}
            value={Math.round(s)}
            onChange={(value) => onChange(rgbToHex(...hslToRgb(h, value, l)), alpha)}
            display={`${Math.round(s)}%`}
          />
          <Slider
            label="Lightness"
            min={0}
            max={100}
            value={Math.round(l)}
            onChange={(value) => onChange(rgbToHex(...hslToRgb(h, s, value)), alpha)}
            display={`${Math.round(l)}%`}
          />
        </div>
      ) : null}
      <Slider
        label="Alpha"
        min={0}
        max={1}
        step={0.01}
        value={alpha}
        onChange={(value) => onChange(hex, value)}
        display={`${Math.round(alpha * 100)}%`}
      />
    </div>
  )
}
