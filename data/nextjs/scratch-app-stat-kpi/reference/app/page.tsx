'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import DashboardPage from './dashboard/page'
import KpiDetailPage from './kpi-detail/page'
import TargetsPage from './targets/page'
import HistoryPage from './history/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'dashboard':
      return <DashboardPage />
    case 'kpi-detail':
      return <KpiDetailPage />
    case 'targets':
      return <TargetsPage />
    case 'history':
      return <HistoryPage />
    default:
      return <DashboardPage />
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
