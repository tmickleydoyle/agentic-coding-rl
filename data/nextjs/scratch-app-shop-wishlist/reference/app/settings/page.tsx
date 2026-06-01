'use client'
import { useShop } from '../../components/AppStateProvider'
import { useWishlist } from '../../hooks/useWishlist'

export default function SettingsPage() {
  const { theme, setTheme } = useShop()
  const { wishlistCount, cartCount } = useWishlist()
  return (
    <section data-testid="page-settings">
      <h1>Settings</h1>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      <p data-testid="counts-summary">
        {wishlistCount} wishlisted, {cartCount} in cart
      </p>
    </section>
  )
}
