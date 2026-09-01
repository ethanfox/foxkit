interface SliderProps {
  id?: string
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  display?: string
}

export function Slider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
}: SliderProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={fieldId} className="text-sm text-ink">
          {label}
        </label>
        <span className="font-mono text-xs tabular-nums text-mute">
          {display ?? String(value)}
        </span>
      </div>
      <input
        id={fieldId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-8 w-full min-w-0 cursor-pointer appearance-none bg-transparent accent-ink"
      />
    </div>
  )
}
