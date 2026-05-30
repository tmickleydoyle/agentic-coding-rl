'use client'
import { AppStateProvider, useShop } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import OrdersPage from './orders/page'
import OrderDetailPage from './order-detail/page'
import TrackPage from './track/page'
import AccountPage from './account/page'

function ActivePage() {
  const { route } = useShop()
  switch (route) {
    case 'order-detail':
      return <OrderDetailPage />
    case 'track':
      return <TrackPage />
    case 'account':
      return <AccountPage />
    default:
      return <OrdersPage />
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
