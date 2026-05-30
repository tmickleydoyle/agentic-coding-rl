'use client'
import { AppStateProvider, useOrdersState } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import OrdersPage from './orders/page'
import OrderDetailPage from './order-detail/page'
import NewPage from './new/page'
import SuppliersPage from './suppliers/page'

function ActivePage() {
  const { route } = useOrdersState()
  switch (route) {
    case 'order-detail':
      return <OrderDetailPage />
    case 'new':
      return <NewPage />
    case 'suppliers':
      return <SuppliersPage />
    default:
      return <OrdersPage />
  }
}

function Shell() {
  const { theme } = useOrdersState()
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
