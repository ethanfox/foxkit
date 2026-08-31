import { create } from 'zustand'
import { defaultImageSettings, type ImageSettings, type ImageSource } from './types'

interface ImageStore {
  file: File | null
  source: ImageSource | null
  previewUrl: string | null
  settings: ImageSettings
  outputSize: number | null
  processing: boolean
  error: string | null
  setFile: (file: File, source: ImageSource, previewUrl: string) => void
  patch: (partial: Partial<ImageSettings>) => void
  setOutputSize: (size: number | null) => void
  setProcessing: (value: boolean) => void
  setError: (error: string | null) => void
  clear: () => void
}

export const useImageStore = create<ImageStore>((set, get) => ({
  file: null,
  source: null,
  previewUrl: null,
  settings: defaultImageSettings(),
  outputSize: null,
  processing: false,
  error: null,
  setFile: (file, source, previewUrl) => {
    const prev = get().previewUrl
    if (prev) URL.revokeObjectURL(prev)
    set({
      file,
      source,
      previewUrl,
      settings: {
        ...defaultImageSettings(source.width, source.height),
        filename: file.name.replace(/\.[^.]+$/, ''),
      },
      outputSize: null,
      error: null,
    })
  },
  patch: (partial) => set({ settings: { ...get().settings, ...partial } }),
  setOutputSize: (outputSize) => set({ outputSize }),
  setProcessing: (processing) => set({ processing }),
  setError: (error) => set({ error }),
  clear: () => {
    const prev = get().previewUrl
    if (prev) URL.revokeObjectURL(prev)
    set({
      file: null,
      source: null,
      previewUrl: null,
      outputSize: null,
      error: null,
    })
  },
}))
