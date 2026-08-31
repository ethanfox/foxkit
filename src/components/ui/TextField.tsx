import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
  hint?: string
}

export function TextField({
  label,
  id,
  hint,
  className = '',
  ...props
}: TextFieldProps) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm text-ink">
        {label}
      </label>
      <input
        id={id}
        className={`min-h-10 rounded-[var(--radius-control)] border border-line bg-raised px-3 font-mono text-sm text-ink ${className}`}
        {...props}
      />
      {hint ? <p className="text-xs text-mute">{hint}</p> : null}
    </div>
  )
}
