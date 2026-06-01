'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import CatalogPage from './catalog/page'
import CourseDetailPage from './course-detail/page'
import MyCoursesPage from './my-courses/page'
import ProgressPage from './progress/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'catalog':
      return <CatalogPage />
    case 'course-detail':
      return <CourseDetailPage />
    case 'my-courses':
      return <MyCoursesPage />
    case 'progress':
      return <ProgressPage />
    default:
      return <CatalogPage />
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
