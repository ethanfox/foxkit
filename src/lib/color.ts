const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i

export function normalizeHex(input: string): string | null {
  const match = input.trim().match(HEX)
  if (!match) return null
  let value = match[1]
  if (value.length === 3 || value.length === 4) {
    value = [...value].map((c) => c + c).join('')
  }
  return `#${value.slice(0, 6).toLowerCase()}`
}

export function hexToRgb(hex: string): [number, number, number] {
  const normalized = normalizeHex(hex) ?? '#000000'
  const n = Number.parseInt(normalized.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')}`
}

export function rgbToHsl(
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  switch (max) {
    case rn:
      h = (gn - bn) / d + (gn < bn ? 6 : 0)
      break
    case gn:
      h = (bn - rn) / d + 2
      break
    default:
      h = (rn - gn) / d + 4
  }
  return [(h * 60) % 360, s * 100, l * 100]
}

export function hslToRgb(
  h: number,
  s: number,
  l: number,
): [number, number, number] {
  const hn = ((h % 360) + 360) % 360
  const sn = s / 100
  const ln = l / 100
  if (sn === 0) {
    const v = Math.round(ln * 255)
    return [v, v, v]
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q
  const hk = hn / 360
  const hue = (t: number) => {
    let u = t
    if (u < 0) u += 1
    if (u > 1) u -= 1
    if (u < 1 / 6) return p + (q - p) * 6 * u
    if (u < 1 / 2) return q
    if (u < 2 / 3) return p + (q - p) * (2 / 3 - u) * 6
    return p
  }
  return [
    Math.round(hue(hk + 1 / 3) * 255),
    Math.round(hue(hk) * 255),
    Math.round(hue(hk - 1 / 3) * 255),
  ]
}

export function colorCss(hex: string, alpha = 1): string {
  const [r, g, b] = hexToRgb(hex)
  if (alpha >= 1) return rgbToHex(r, g, b)
  const a = Math.max(0, Math.min(1, alpha))
  return `rgba(${r}, ${g}, ${b}, ${roundTo(a, 3)})`
}

export function roundTo(value: number, digits: number): number {
  const f = 10 ** digits
  return Math.round(value * f) / f
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}
