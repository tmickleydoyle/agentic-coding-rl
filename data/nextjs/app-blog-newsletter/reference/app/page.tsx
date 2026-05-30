'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import DashboardPage from './dashboard/page'
import CampaignsPage from './campaigns/page'
import SubscribersPage from './subscribers/page'
import ComposePage from './compose/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'dashboard':
      return <DashboardPage />
    case 'campaigns':
      return <CampaignsPage />
    case 'subscribers':
      return <SubscribersPage />
    case 'compose':
      return <ComposePage />
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
