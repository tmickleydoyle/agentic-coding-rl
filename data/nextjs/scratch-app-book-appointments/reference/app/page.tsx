'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ServicesPage from './services/page'
import BookPage from './book/page'
import SchedulePage from './schedule/page'
import MyBookingsPage from './my-bookings/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'services':
      return <ServicesPage />
    case 'book':
      return <BookPage />
    case 'schedule':
      return <SchedulePage />
    case 'my-bookings':
      return <MyBookingsPage />
    default:
      return <ServicesPage />
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
