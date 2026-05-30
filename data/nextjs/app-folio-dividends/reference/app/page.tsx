'use client'
import { DividendsProvider, useDividends } from '../components/DividendsProvider'
import NavBar from '../components/NavBar'
import DashboardPage from './dashboard/page'
import HoldingDetailPage from './holding-detail/page'
import AddPage from './add/page'
import CalendarPage from './calendar/page'

function ActivePage() {
  const { route } = useDividends()
  switch (route) {
    case 'dashboard':
      return <DashboardPage />
    case 'holding-detail':
      return <HoldingDetailPage />
    case 'add':
      return <AddPage />
    case 'calendar':
      return <CalendarPage />
    default:
      return <DashboardPage />
  }
}

function Shell() {
  const { theme } = useDividends()
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
    <DividendsProvider>
      <Shell />
    </DividendsProvider>
  )
}
