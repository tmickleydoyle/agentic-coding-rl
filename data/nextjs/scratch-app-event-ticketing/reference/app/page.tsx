'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import EventsPage from './events/page'
import EventDetailPage from './event-detail/page'
import CheckoutPage from './checkout/page'
import MyTicketsPage from './my-tickets/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'events':
      return <EventsPage />
    case 'event-detail':
      return <EventDetailPage />
    case 'checkout':
      return <CheckoutPage />
    case 'my-tickets':
      return <MyTicketsPage />
    default:
      return <EventsPage />
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
