'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import RequestsPage from './requests/page'
import RequestDetailPage from './request-detail/page'
import BalancesPage from './balances/page'
import CalendarPage from './calendar/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'requests':
      return <RequestsPage />
    case 'request-detail':
      return <RequestDetailPage />
    case 'balances':
      return <BalancesPage />
    case 'calendar':
      return <CalendarPage />
    default:
      return <RequestsPage />
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
