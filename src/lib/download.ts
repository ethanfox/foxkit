export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.append(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function downloadText(
  text: string,
  filename: string,
  type = 'application/json',
) {
  downloadBlob(new Blob([text], { type: `${type};charset=utf-8` }), filename)
}

export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.append(area)
  area.select()
  document.execCommand('copy')
  area.remove()
}

export function sanitizeFilename(name: string, fallback: string): string {
  const cleaned = name
    .trim()
    .replace(/[^\w.\- ]+/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80)
  return cleaned || fallback
}
