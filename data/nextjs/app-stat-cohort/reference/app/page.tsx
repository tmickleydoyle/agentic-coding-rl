'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import CohortsPage from './cohorts/page'
import RetentionPage from './retention/page'
import BreakdownPage from './breakdown/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'cohorts':
      return <CohortsPage />
    case 'retention':
      return <RetentionPage />
    case 'breakdown':
      return <BreakdownPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <CohortsPage />
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
