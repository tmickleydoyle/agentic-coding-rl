'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import TicketsPage from './tickets/page'
import TicketDetailPage from './ticket-detail/page'
import BreachesPage from './breaches/page'
import DashboardPage from './dashboard/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'tickets':
      return <TicketsPage />
    case 'ticket-detail':
      return <TicketDetailPage />
    case 'breaches':
      return <BreachesPage />
    case 'dashboard':
      return <DashboardPage />
    default:
      return <TicketsPage />
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
