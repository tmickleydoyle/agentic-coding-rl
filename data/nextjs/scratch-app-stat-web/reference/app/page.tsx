'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import OverviewPage from './overview/page'
import PagesPage from './pages/page'
import SourcesPage from './sources/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'overview':
      return <OverviewPage />
    case 'pages':
      return <PagesPage />
    case 'sources':
      return <SourcesPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <OverviewPage />
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
