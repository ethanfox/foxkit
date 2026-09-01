import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const styles: Record<Variant, string> = {
  primary:
    'bg-ink text-black hover:bg-white active:scale-[0.96] disabled:bg-mute disabled:text-black/50',
  ghost:
    'bg-raised text-ink hover:bg-line active:scale-[0.96] disabled:text-mute',
  danger:
    'bg-danger text-white hover:brightness-110 active:scale-[0.96] disabled:opacity-50',
}

export function Button({
  variant = 'ghost',
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-[var(--radius-control)] px-3.5 text-sm font-medium transition-[transform,background-color,color] duration-150 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
