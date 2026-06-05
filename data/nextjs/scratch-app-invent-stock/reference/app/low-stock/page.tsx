'use client'
import { useStock } from '../../components/AppStateProvider'
import { useProducts } from '../../hooks/useProducts'

export default function LowStockPage() {
  const { theme, setTheme, selectProduct } = useStock()
  const { lowProducts } = useProducts()

  return (
    <section data-testid="page-low-stock">
      <h1>Low stock</h1>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      <p data-testid="low-count">{lowProducts.length} products at or below reorder point</p>
      {lowProducts.length === 0 ? (
        <p data-testid="all-stocked">All products are sufficiently stocked.</p>
      ) : (
        <ul data-testid="low-list">
          {lowProducts.map((p) => (
            <li key={p.id} data-testid={`low-${p.id}`}>
              <span data-testid={`low-${p.id}-name`}>{p.name}</span>
              <span data-testid={`low-${p.id}-short`}>{p.reorderPoint - p.qty}</span>
              <button data-testid={`low-view-${p.id}`} onClick={() => selectProduct(p.id)}>
                View
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
