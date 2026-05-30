'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ObjectivesPage from './objectives/page'
import ObjectiveDetailPage from './objective-detail/page'
import AddPage from './add/page'
import DashboardPage from './dashboard/page'

function ActivePage() {
  const { route } = useApp()
  // TODO: render the page matching `route`.
  switch (route) {
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
  // TODO: reflect theme as data-theme on app-root.
  return (
    <div data-testid="app-root">
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
