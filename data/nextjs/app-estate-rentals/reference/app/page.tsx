'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import UnitsPage from './units/page'
import UnitDetailPage from './unit-detail/page'
import ApplicationsPage from './applications/page'
import OccupancyPage from './occupancy/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'units':
      return <UnitsPage />
    case 'unit-detail':
      return <UnitDetailPage />
    case 'applications':
      return <ApplicationsPage />
    case 'occupancy':
      return <OccupancyPage />
    default:
      return <UnitsPage />
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
