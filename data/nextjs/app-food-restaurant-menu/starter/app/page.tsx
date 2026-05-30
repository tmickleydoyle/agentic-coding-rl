'use client'
import { AppStateProvider, useMenu } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import MenuPage from './menu/page'
import ItemDetailPage from './item-detail/page'
import CartPage from './cart/page'
import CheckoutPage from './checkout/page'

function ActivePage() {
  const { route } = useMenu()
  switch (route) {
    case 'menu':
      return <MenuPage />
    case 'item-detail':
      return <ItemDetailPage />
    case 'cart':
      return <CartPage />
    case 'checkout':
      return <CheckoutPage />
    default:
      return <MenuPage />
  }
}

function Shell() {
  const { theme } = useMenu()
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
