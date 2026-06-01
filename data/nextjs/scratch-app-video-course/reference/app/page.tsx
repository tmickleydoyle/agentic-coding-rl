'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import CoursesPage from './courses/page'
import CourseDetailPage from './course-detail/page'
import PlayerPage from './player/page'
import ProgressPage from './progress/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'courses':
      return <CoursesPage />
    case 'course-detail':
      return <CourseDetailPage />
    case 'player':
      return <PlayerPage />
    case 'progress':
      return <ProgressPage />
    default:
      return <CoursesPage />
  }
}

function Shell() {
  const { theme } = useApp()
  return (
    <div data-testid="app-root" data-theme={theme}>
      <NavBar />
      <main data-testid="page-content">
        <ActivePage />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  )
}
