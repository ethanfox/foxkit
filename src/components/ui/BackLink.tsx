export function BackLink() {
  return (
    <a
      href={import.meta.env.BASE_URL}
      className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-raised px-3.5 text-sm font-medium transition-[background-color,color] duration-150 hover:bg-line"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 6l-6 6 6 6" />
      </svg>
      Back
    </a>
  )
}
