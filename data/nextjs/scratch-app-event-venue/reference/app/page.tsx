'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import VenuesPage from './venues/page'
import VenueDetailPage from './venue-detail/page'
import BookPage from './book/page'
import BookingsPage from './bookings/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'venues':
      return <VenuesPage />
    case 'venue-detail':
      return <VenueDetailPage />
    case 'book':
      return <BookPage />
    case 'bookings':
      return <BookingsPage />
    default:
      return <VenuesPage />
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
