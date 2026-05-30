'use client'
import { AppStateProvider, useShop } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import CartPage from './cart/page'
import CouponsPage from './coupons/page'
import CheckoutPage from './checkout/page'
import ConfirmationPage from './confirmation/page'

function ActivePage() {
  const { route } = useShop()
  switch (route) {
    case 'cart':
      return <CartPage />
    case 'coupons':
      return <CouponsPage />
    case 'checkout':
      return <CheckoutPage />
    case 'confirmation':
      return <ConfirmationPage />
    default:
      return <CartPage />
  }
}

function Shell() {
  const { theme } = useShop()
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
