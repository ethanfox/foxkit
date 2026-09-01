import { Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from '@/components/workspace/Shell'
import { AboutPage } from '@/features/home/AboutPage'
import { HomePage } from '@/features/home/HomePage'
import { GradientPage } from '@/features/gradient/GradientPage'
import { ImagePage } from '@/features/image/ImagePage'
import { PalettePage } from '@/features/palette/PalettePage'

export function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<HomePage />} />
        <Route path="gradient" element={<GradientPage />} />
        <Route path="image" element={<ImagePage />} />
        <Route path="palette" element={<PalettePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route
          path="privacy"
          element={<Navigate to={{ pathname: '/about', hash: 'privacy' }} replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
