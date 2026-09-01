interface WordmarkProps {
  compact?: boolean
  className?: string
}

export function Wordmark({ compact = false, className = '' }: WordmarkProps) {
  const src = compact
    ? `${import.meta.env.BASE_URL}brand/foxkit-mark.svg`
    : `${import.meta.env.BASE_URL}brand/foxkit-wordmark.svg`
  return (
    <img
      src={src}
      alt="FoxKit"
      className={`brand-invert select-none ${compact ? 'h-8 w-auto' : 'h-16 w-auto sm:h-20'} ${className}`}
    />
  )
}

export function AppIcon({ className = '' }: { className?: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}icons/app-icon.svg`}
      alt=""
      className={`select-none ${className}`}
    />
  )
}
