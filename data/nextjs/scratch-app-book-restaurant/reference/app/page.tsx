'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import AvailabilityPage from './availability/page'
import ReservePage from './reserve/page'
import ReservationsPage from './reservations/page'
import TablesPage from './tables/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'availability':
      return <AvailabilityPage />
    case 'reserve':
      return <ReservePage />
    case 'reservations':
      return <ReservationsPage />
    case 'tables':
      return <TablesPage />
    default:
      return <AvailabilityPage />
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
