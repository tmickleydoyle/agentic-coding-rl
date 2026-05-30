'use client'
import { AppStateProvider, useShop } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import CatalogPage from './catalog/page'
import ProductPage from './product/page'
import CartPage from './cart/page'
import CheckoutPage from './checkout/page'

function ActivePage() {
  const { route } = useShop()
  switch (route) {
    case 'product':
      return <ProductPage />
    case 'cart':
      return <CartPage />
    case 'checkout':
      return <CheckoutPage />
    default:
      return <CatalogPage />
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
