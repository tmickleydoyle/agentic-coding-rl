'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import TicketsPage from './tickets/page'
import TicketDetailPage from './ticket-detail/page'
import NewTicketPage from './new/page'
import QueuePage from './queue/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'tickets':
      return <TicketsPage />
    case 'ticket-detail':
      return <TicketDetailPage />
    case 'new':
      return <NewTicketPage />
    case 'queue':
      return <QueuePage />
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
