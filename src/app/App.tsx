import { Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from '@/components/workspace/Shell'
import { AboutPage } from '@/features/home/AboutPage'
import { HomePage } from '@/features/home/HomePage'
import { PrivacyPage } from '@/features/home/PrivacyPage'
import { GradientPage } from '@/features/gradient/GradientPage'
import { ImagePage } from '@/features/image/ImagePage'

export function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<HomePage />} />
        <Route path="gradient" element={<GradientPage />} />
        <Route path="image" element={<ImagePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
