interface Option<T extends string> {
  value: T
  label: string
  disabled?: boolean
}

interface SegmentedControlProps<T extends string> {
  label: string
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
  hideLabel?: boolean
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  hideLabel = false,
}: SegmentedControlProps<T>) {
  return (
    <fieldset className="grid gap-1.5">
      <legend className={hideLabel ? 'sr-only' : 'text-sm text-ink'}>{label}</legend>
      <div
        role="radiogroup"
        aria-label={label}
        className="grid grid-cols-2 gap-1 rounded-[var(--radius-control)] bg-raised p-1"
      >
        {options.map((option) => {
          const selected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={option.disabled}
              onClick={() => onChange(option.value)}
              className={`min-h-9 min-w-0 rounded-md px-2 text-sm transition-[background-color,color] duration-150 disabled:text-mute ${
                selected ? 'bg-ink text-black' : 'text-ink hover:bg-line'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
