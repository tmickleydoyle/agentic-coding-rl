'use client'
import { useApp } from '../../components/AppStateProvider'

export default function ProductsPage() {
  const { products, suppliers, theme, setTheme, selectSupplier } = useApp()
  const supplierName = (id: string): string => suppliers.find((s) => s.id === id)?.name ?? 'Unknown'
  return (
    <section data-testid="page-products">
      <h1>Products</h1>
      <p data-testid="product-count">{products.length}</p>
      <ul data-testid="product-list">
        {products.map((p) => (
          <li key={p.id} data-testid={`product-${p.id}`}>
            <span data-testid={`product-${p.id}-name`}>{p.name}</span>
            <span data-testid={`product-${p.id}-supplier`}>{supplierName(p.supplierId)}</span>
            <span data-testid={`product-${p.id}-price`}>{p.price}</span>
            <button data-testid={`product-${p.id}-open-supplier`} onClick={() => selectSupplier(p.supplierId)}>
              Supplier
            </button>
          </li>
        ))}
      </ul>
      <div data-testid="theme-section">
        <p data-testid="current-theme">{theme}</p>
        <button data-testid="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
      </div>
    </section>
  )
}
