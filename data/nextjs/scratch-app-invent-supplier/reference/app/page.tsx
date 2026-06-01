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
    case 'suppliers':
      return <SuppliersPage />
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
