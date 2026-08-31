import { createGradient } from './defaults'
import type { GradientDocument } from './types'

type ShareState = Omit<GradientDocument, 'id' | 'updatedAt'>

export function compactGradient(doc: GradientDocument): ShareState {
  const { id: _id, updatedAt: _updatedAt, ...rest } = doc
  return rest
}

export function encodeGradientState(doc: GradientDocument): string {
  const json = JSON.stringify(compactGradient(doc))
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeGradientState(token: string): GradientDocument | null {
  try {
    const padded = token.replace(/-/g, '+').replace(/_/g, '/')
    const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
    const binary = atob(padded + pad)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)
    const parsed = JSON.parse(json) as Partial<GradientDocument>
    if (!parsed || typeof parsed !== 'object') return null
    if (!parsed.stops && !parsed.points) return null
    return createGradient({
      ...parsed,
      version: 1,
      updatedAt: Date.now(),
    })
  } catch {
    return null
  }
}

export function readShareFromLocation(
  search: string,
  hash: string,
): GradientDocument | null {
  const fromQuery = new URLSearchParams(search).get('g')
  if (fromQuery) return decodeGradientState(fromQuery)
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  const fromHash = new URLSearchParams(raw).get('g')
  return fromHash ? decodeGradientState(fromHash) : null
}

export function shareSearchParam(doc: GradientDocument): string {
  return `g=${encodeGradientState(doc)}`
}
