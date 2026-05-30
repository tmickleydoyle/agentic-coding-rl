'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import FunnelPage from './funnel/page'
import StepsPage from './steps/page'
import SegmentsPage from './segments/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useApp()
  // TODO: render the page matching `route`.
  switch (route) {
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
