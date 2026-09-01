import { create } from 'zustand'
import { defaultImageSettings, type ImageSettings, type ImageSource } from './types'

export interface ImageOutput {
  blob: Blob
  url: string
  width: number
  height: number
}

interface ImageStore {
  file: File | null
  source: ImageSource | null
  previewUrl: string | null
  settings: ImageSettings
  output: ImageOutput | null
  outputSize: number | null
  processing: boolean
  error: string | null
  setFile: (file: File, source: ImageSource, previewUrl: string) => void
  patch: (partial: Partial<ImageSettings>) => void
  setOutput: (output: Omit<ImageOutput, 'url'> | null) => void
  setProcessing: (value: boolean) => void
  setError: (error: string | null) => void
  clear: () => void
}

function revoke(url: string | null) {
  if (url) URL.revokeObjectURL(url)
}

export const useImageStore = create<ImageStore>((set, get) => ({
  file: null,
  source: null,
  previewUrl: null,
  settings: defaultImageSettings(),
  output: null,
  outputSize: null,
  processing: false,
  error: null,
  setFile: (file, source, previewUrl) => {
    const current = get()
    revoke(current.previewUrl)
    revoke(current.output?.url ?? null)
    set({
      file,
      source,
      previewUrl,
      settings: {
        ...defaultImageSettings(source.width, source.height),
        filename: file.name.replace(/\.[^.]+$/, ''),
      },
      output: null,
      outputSize: null,
      error: null,
    })
  },
  patch: (partial) => set({ settings: { ...get().settings, ...partial } }),
  setOutput: (next) => {
    revoke(get().output?.url ?? null)
    if (!next) {
      set({ output: null, outputSize: null })
      return
    }
    const url = URL.createObjectURL(next.blob)
    set({
      output: { ...next, url },
      outputSize: next.blob.size,
    })
  },
  setProcessing: (processing) => set({ processing }),
  setError: (error) => set({ error }),
  clear: () => {
    const current = get()
    revoke(current.previewUrl)
    revoke(current.output?.url ?? null)
    set({
      file: null,
      source: null,
      previewUrl: null,
      output: null,
      outputSize: null,
      error: null,
      processing: false,
      settings: defaultImageSettings(),
    })
  },
}))
