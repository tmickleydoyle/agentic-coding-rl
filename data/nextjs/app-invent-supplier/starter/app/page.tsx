'use client'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import SuppliersPage from './suppliers/page'
import SupplierDetailPage from './supplier-detail/page'
import ProductsPage from './products/page'
import AddSupplierPage from './add/page'

function ActivePage() {
  const { route } = useApp()
  switch (route) {
    case 'supplier-detail':
      return <SupplierDetailPage />
    case 'products':
      return <ProductsPage />
    case 'add':
      return <AddSupplierPage />
    default:
      return <SuppliersPage />
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
