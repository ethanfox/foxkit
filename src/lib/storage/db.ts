import Dexie, { type Table } from 'dexie'
import type { GradientDocument } from '@/features/gradient/types'
import type { ImageSettings } from '@/features/image/types'
import { uid } from '@/lib/color'
import type { SavedPalette } from '@/features/palette/types'

export interface SavedGradient extends GradientDocument {
  savedAt: number
}

export interface AppMeta {
  key: string
  lastGradientId?: string
  imageSettings?: ImageSettings
}

class FoxKitDB extends Dexie {
  gradients!: Table<SavedGradient, string>
  palettes!: Table<SavedPalette, string>
  meta!: Table<AppMeta, string>

  constructor() {
    super('foxkit')
    this.version(1).stores({
      gradients: 'id, updatedAt, name, savedAt',
      meta: 'key',
    })
    this.version(2).stores({
      gradients: 'id, updatedAt, name, savedAt',
      palettes: 'id, savedAt, name',
      meta: 'key',
    })
  }
}

export const db = new FoxKitDB()

export async function listSavedGradients(): Promise<SavedGradient[]> {
  return db.gradients.orderBy('savedAt').reverse().toArray()
}

export async function saveGradient(doc: GradientDocument): Promise<SavedGradient> {
  const record: SavedGradient = {
    ...doc,
    updatedAt: Date.now(),
    savedAt: Date.now(),
  }
  await db.gradients.put(record)
  await db.meta.put({ key: 'session', lastGradientId: record.id })
  return record
}

export async function deleteGradient(id: string): Promise<void> {
  await db.gradients.delete(id)
}

export async function getGradient(id: string): Promise<SavedGradient | undefined> {
  return db.gradients.get(id)
}

export async function saveImageSettings(settings: ImageSettings): Promise<void> {
  await db.meta.put({ key: 'image', imageSettings: settings })
}

export async function loadImageSettings(): Promise<ImageSettings | undefined> {
  const row = await db.meta.get('image')
  return row?.imageSettings
}

export async function listSavedPalettes(): Promise<SavedPalette[]> {
  return db.palettes.orderBy('savedAt').reverse().toArray()
}

export async function savePalette(input: {
  id?: string
  name: string
  colors: SavedPalette['colors']
}): Promise<SavedPalette> {
  const record: SavedPalette = {
    id: input.id ?? uid('pal'),
    name: input.name,
    colors: input.colors,
    savedAt: Date.now(),
  }
  await db.palettes.put(record)
  return record
}

export async function deletePalette(id: string): Promise<void> {
  await db.palettes.delete(id)
}

export async function getPalette(id: string): Promise<SavedPalette | undefined> {
  return db.palettes.get(id)
}
