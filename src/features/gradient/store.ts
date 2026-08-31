import { create } from 'zustand'
import { clamp, uid } from '@/lib/color'
import { createGradient, defaultPoints, defaultStops } from './defaults'
import type {
  ColorStop,
  GradientDocument,
  GradientType,
  MeshPoint,
} from './types'
import { MAX_MESH_POINTS, MIN_MESH_POINTS } from './types'

interface GradientStore {
  doc: GradientDocument
  setDoc: (doc: GradientDocument) => void
  patch: (partial: Partial<GradientDocument>) => void
  setType: (type: GradientType) => void
  updateStop: (id: string, partial: Partial<ColorStop>) => void
  addStop: () => void
  duplicateStop: (id: string) => void
  removeStop: (id: string) => void
  reorderStops: (from: number, to: number) => void
  updatePoint: (id: string, partial: Partial<MeshPoint>) => void
  addPoint: () => void
  removePoint: (id: string) => void
}

export const useGradientStore = create<GradientStore>((set, get) => ({
  doc: createGradient(),
  setDoc: (doc) => set({ doc: { ...doc, updatedAt: Date.now() } }),
  patch: (partial) =>
    set({ doc: { ...get().doc, ...partial, updatedAt: Date.now() } }),
  setType: (type) => {
    const doc = get().doc
    set({
      doc: {
        ...doc,
        type,
        stops: doc.stops.length ? doc.stops : defaultStops(),
        points: doc.points.length ? doc.points : defaultPoints(),
        updatedAt: Date.now(),
      },
    })
  },
  updateStop: (id, partial) => {
    const doc = get().doc
    set({
      doc: {
        ...doc,
        stops: doc.stops.map((stop) =>
          stop.id === id
            ? {
                ...stop,
                ...partial,
                position: clamp(partial.position ?? stop.position, 0, 100),
              }
            : stop,
        ),
        updatedAt: Date.now(),
      },
    })
  },
  addStop: () => {
    const doc = get().doc
    const last = doc.stops[doc.stops.length - 1]
    set({
      doc: {
        ...doc,
        stops: [
          ...doc.stops,
          {
            id: uid('stop'),
            hex: last?.hex ?? '#ffffff',
            alpha: 1,
            position: clamp((last?.position ?? 50) + 10, 0, 100),
          },
        ],
        updatedAt: Date.now(),
      },
    })
  },
  duplicateStop: (id) => {
    const doc = get().doc
    const stop = doc.stops.find((item) => item.id === id)
    if (!stop) return
    set({
      doc: {
        ...doc,
        stops: [
          ...doc.stops,
          {
            ...stop,
            id: uid('stop'),
            position: clamp(stop.position + 5, 0, 100),
          },
        ],
        updatedAt: Date.now(),
      },
    })
  },
  removeStop: (id) => {
    const doc = get().doc
    if (doc.stops.length <= 2) return
    set({
      doc: {
        ...doc,
        stops: doc.stops.filter((stop) => stop.id !== id),
        updatedAt: Date.now(),
      },
    })
  },
  reorderStops: (from, to) => {
    const doc = get().doc
    const next = [...doc.stops]
    const [moved] = next.splice(from, 1)
    if (!moved) return
    next.splice(to, 0, moved)
    set({ doc: { ...doc, stops: next, updatedAt: Date.now() } })
  },
  updatePoint: (id, partial) => {
    const doc = get().doc
    set({
      doc: {
        ...doc,
        points: doc.points.map((point) =>
          point.id === id
            ? {
                ...point,
                ...partial,
                x: clamp(partial.x ?? point.x, 0, 1),
                y: clamp(partial.y ?? point.y, 0, 1),
                radius: clamp(partial.radius ?? point.radius, 0.1, 1),
              }
            : point,
        ),
        updatedAt: Date.now(),
      },
    })
  },
  addPoint: () => {
    const doc = get().doc
    if (doc.points.length >= MAX_MESH_POINTS) return
    set({
      doc: {
        ...doc,
        points: [
          ...doc.points,
          {
            id: uid('pt'),
            hex: '#ffffff',
            alpha: 1,
            x: 0.5,
            y: 0.5,
            radius: 0.4,
          },
        ],
        updatedAt: Date.now(),
      },
    })
  },
  removePoint: (id) => {
    const doc = get().doc
    if (doc.points.length <= MIN_MESH_POINTS) return
    set({
      doc: {
        ...doc,
        points: doc.points.filter((point) => point.id !== id),
        updatedAt: Date.now(),
      },
    })
  },
}))
