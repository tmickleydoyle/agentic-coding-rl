'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import HiresPage from './hires/page'
import HireDetailPage from './hire-detail/page'
import TasksPage from './tasks/page'
import ProgressPage from './progress/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'hires':
      return <HiresPage />
    case 'hire-detail':
      return <HireDetailPage />
    case 'tasks':
      return <TasksPage />
    case 'progress':
      return <ProgressPage />
    default:
      return <HiresPage />
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
