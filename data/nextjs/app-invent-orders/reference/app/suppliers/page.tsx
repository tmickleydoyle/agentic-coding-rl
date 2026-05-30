'use client'
import { useOrdersState } from '../../components/AppStateProvider'
import { useOrders } from '../../hooks/useOrders'

export default function SuppliersPage() {
  const { theme, setTheme } = useOrdersState()
  const { suppliers } = useOrders()

  return (
    <section data-testid="page-suppliers">
      <h1>Suppliers</h1>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      <p data-testid="supplier-count">{suppliers.length} suppliers</p>
      <ul data-testid="supplier-list">
        {suppliers.map((s) => (
          <li key={s.supplier} data-testid={`supplier-${s.supplier}`}>
            <span data-testid={`supplier-${s.supplier}-orders`}>{s.orders}</span>
            <span data-testid={`supplier-${s.supplier}-outstanding`}>{s.outstanding}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
