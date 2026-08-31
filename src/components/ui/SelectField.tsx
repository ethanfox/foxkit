import type { SelectHTMLAttributes } from 'react'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  id: string
}

export function SelectField({
  label,
  id,
  children,
  className = '',
  ...props
}: SelectFieldProps) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm text-ink">
        {label}
      </label>
      <select
        id={id}
        className={`min-h-10 rounded-[var(--radius-control)] border border-line bg-raised px-3 text-sm text-ink ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
