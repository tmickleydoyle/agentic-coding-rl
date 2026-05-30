'use client'
import { AppStateProvider, useStock } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ProductsPage from './products/page'
import ProductDetailPage from './product-detail/page'
import AdjustPage from './adjust/page'
import LowStockPage from './low-stock/page'

function ActivePage() {
  const { route } = useStock()
  switch (route) {
    case 'product-detail':
      return <ProductDetailPage />
    case 'adjust':
      return <AdjustPage />
    case 'low-stock':
      return <LowStockPage />
    default:
      return <ProductsPage />
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
