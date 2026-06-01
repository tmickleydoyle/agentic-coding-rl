'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ProvidersPage from './providers/page'
import BookPage from './book/page'
import AppointmentsPage from './appointments/page'
import HistoryPage from './history/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'providers':
      return <ProvidersPage />
    case 'book':
      return <BookPage />
    case 'appointments':
      return <AppointmentsPage />
    case 'history':
      return <HistoryPage />
    default:
      return <ProvidersPage />
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
