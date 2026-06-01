'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import FunnelPage from './funnel/page'
import StepsPage from './steps/page'
import SegmentsPage from './segments/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'funnel':
      return <FunnelPage />
    case 'steps':
      return <StepsPage />
    case 'segments':
      return <SegmentsPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <FunnelPage />
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
