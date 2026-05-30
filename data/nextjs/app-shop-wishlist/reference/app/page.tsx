'use client'
import { AppStateProvider, useShop } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import BrowsePage from './browse/page'
import WishlistPage from './wishlist/page'
import CartPage from './cart/page'
import SettingsPage from './settings/page'

function ActivePage() {
  const { route } = useShop()
  switch (route) {
    case 'browse':
      return <BrowsePage />
    case 'wishlist':
      return <WishlistPage />
    case 'cart':
      return <CartPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <BrowsePage />
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
