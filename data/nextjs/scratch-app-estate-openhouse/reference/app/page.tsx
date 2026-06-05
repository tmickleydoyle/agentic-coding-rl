'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import SchedulePage from './schedule/page'
import HouseDetailPage from './house-detail/page'
import RegisterPage from './register/page'
import FeedbackPage from './feedback/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'schedule':
      return <SchedulePage />
    case 'house-detail':
      return <HouseDetailPage />
    case 'register':
      return <RegisterPage />
    case 'feedback':
      return <FeedbackPage />
    default:
      return <SchedulePage />
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
