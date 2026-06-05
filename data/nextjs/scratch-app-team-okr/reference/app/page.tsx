'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ObjectivesPage from './objectives/page'
import ObjectiveDetailPage from './objective-detail/page'
import AddPage from './add/page'
import DashboardPage from './dashboard/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'objectives':
      return <ObjectivesPage />
    case 'objective-detail':
      return <ObjectiveDetailPage />
    case 'add':
      return <AddPage />
    case 'dashboard':
      return <DashboardPage />
    default:
      return <ObjectivesPage />
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
