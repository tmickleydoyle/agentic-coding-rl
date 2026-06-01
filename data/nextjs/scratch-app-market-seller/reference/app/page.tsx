'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ProductsPage from './products/page'
import OrdersPage from './orders/page'
import AddPage from './add/page'
import RevenuePage from './revenue/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'products':
      return <ProductsPage />
    case 'orders':
      return <OrdersPage />
    case 'add':
      return <AddPage />
    case 'revenue':
      return <RevenuePage />
    default:
      return <ProductsPage />
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
