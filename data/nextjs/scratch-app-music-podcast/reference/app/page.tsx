'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ShowsPage from './shows/page'
import ShowDetailPage from './show-detail/page'
import QueuePage from './queue/page'
import SubscriptionsPage from './subscriptions/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'shows':
      return <ShowsPage />
    case 'show-detail':
      return <ShowDetailPage />
    case 'queue':
      return <QueuePage />
    case 'subscriptions':
      return <SubscriptionsPage />
    default:
      return <ShowsPage />
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
