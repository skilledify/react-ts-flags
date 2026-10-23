import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { ProgressProvider } from './lib/progress'
import { AchievementsPage } from './pages/AchievementsPage'
import { CollectionPage } from './pages/CollectionPage'
import { ContinentPage } from './pages/ContinentPage'
import { HomePage } from './pages/HomePage'
import { MapPage } from './pages/MapPage'
import { MemoryPage } from './pages/MemoryPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { QuizPage } from './pages/QuizPage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <ProgressProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="map/:continentId" element={<ContinentPage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="quiz/:category" element={<QuizPage />} />
            <Route path="memory" element={<MemoryPage />} />
            <Route path="collection" element={<CollectionPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ProgressProvider>
    </BrowserRouter>
  )
}
