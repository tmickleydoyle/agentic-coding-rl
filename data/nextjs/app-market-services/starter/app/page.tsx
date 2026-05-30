'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import GigsPage from './gigs/page'
import DetailPage from './detail/page'
import BookPage from './book/page'
import BookingsPage from './bookings/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'gigs':
      return <GigsPage />
    case 'detail':
      return <DetailPage />
    case 'book':
      return <BookPage />
    case 'bookings':
      return <BookingsPage />
    default:
      return <GigsPage />
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
