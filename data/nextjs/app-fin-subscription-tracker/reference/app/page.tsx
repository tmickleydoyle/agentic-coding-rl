'use client'
import { SubsProvider, useSubs } from '../components/SubsProvider'
import NavBar from '../components/NavBar'
import DashboardPage from './dashboard/page'
import SubscriptionsPage from './subscriptions/page'
import AddPage from './add/page'
import UpcomingPage from './upcoming/page'

function ActivePage() {
  const { route } = useSubs()
  switch (route) {
    case 'dashboard':
      return <DashboardPage />
    case 'subscriptions':
      return <SubscriptionsPage />
    case 'add':
      return <AddPage />
    case 'upcoming':
      return <UpcomingPage />
    default:
      return <DashboardPage />
  }
}

function Shell() {
  const { theme } = useSubs()
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
    <SubsProvider>
      <Shell />
    </SubsProvider>
  )
}
