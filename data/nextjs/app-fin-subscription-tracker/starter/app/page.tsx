'use client'
import { SubsProvider, useSubs } from '../components/SubsProvider'
import NavBar from '../components/NavBar'
import DashboardPage from './dashboard/page'
import SubscriptionsPage from './subscriptions/page'
import AddPage from './add/page'
import UpcomingPage from './upcoming/page'

function ActivePage() {
  const { route } = useSubs()
  // TODO: render the page matching `route`.
  switch (route) {
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
    <SubsProvider>
      <Shell />
    </SubsProvider>
  )
}
