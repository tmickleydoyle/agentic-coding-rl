'use client'
import { useShop } from '../../components/AppStateProvider'
import { useOrders } from '../../hooks/useOrders'

export default function AccountPage() {
  const { theme, setTheme } = useShop()
  const { counts } = useOrders()
  return (
    <section data-testid="page-account">
      <h1>Account</h1>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      <p data-testid="order-summary">
        {counts.total} orders: {counts.delivered} delivered, {counts.shipped} shipped,{' '}
        {counts.placed} placed
      </p>
    </section>
  )
}
