'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import DashboardPage from './dashboard/page'
import CampaignsPage from './campaigns/page'
import SubscribersPage from './subscribers/page'
import ComposePage from './compose/page'

function ActivePage() {
  const { route } = useApp()
  // TODO: render the page matching `route`.
  switch (route) {
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
  // TODO: reflect theme as data-theme on app-root.
  return (
    <div data-testid="app-root">
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
