'use client'
import { useStock } from '../../components/AppStateProvider'
import { useProducts } from '../../hooks/useProducts'
import ProductRow from '../../components/ProductRow'
import StatCard from '../../components/StatCard'
import type { StockFilter } from '../../lib/types'

export default function ProductsPage() {
  const { stockFilter, setStockFilter, selectProduct } = useStock()
  const { filtered, stats } = useProducts()

  return (
    <section data-testid="page-products">
      <h1>Products</h1>
      <StatCard label="Total" value={stats.total} testid="stat-total" />
      <StatCard label="Low" value={stats.low} testid="stat-low" />
      <StatCard label="Units" value={stats.units} testid="stat-units" />
      <label htmlFor="stock-filter">Filter</label>
      <select
        id="stock-filter"
        data-testid="stock-filter"
        value={stockFilter}
        onChange={(e) => setStockFilter(e.target.value as StockFilter)}
      >
        <option value="all">All</option>
        <option value="low">Low</option>
        <option value="ok">OK</option>
      </select>
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No products match this filter.</p>
      ) : (
        <ul data-testid="product-list">
          {filtered.map((p) => (
            <ProductRow key={p.id} product={p} onView={selectProduct} />
          ))}
        </ul>
      )}
    </section>
  )
}
