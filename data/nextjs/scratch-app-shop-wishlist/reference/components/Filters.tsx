'use client'
import type { CategoryFilter, Product } from '../lib/types'

export default function Filters({
  products,
  categoryFilter,
  maxPrice,
  onCategoryChange,
  onMaxPriceChange,
}: {
  products: Product[]
  categoryFilter: CategoryFilter
  maxPrice: number | null
  onCategoryChange: (filter: CategoryFilter) => void
  onMaxPriceChange: (value: number | null) => void
}) {
  const categories: string[] = []
  products.forEach((p) => {
    if (categories.indexOf(p.category) === -1) categories.push(p.category)
  })
  return (
    <div data-testid="filters">
      <label htmlFor="category-filter">Category</label>
      <select
        id="category-filter"
        data-testid="category-filter"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="all">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label htmlFor="max-price">Max price</label>
      <input
        id="max-price"
        type="number"
        data-testid="max-price"
        value={maxPrice === null ? '' : maxPrice}
        onChange={(e) => {
          const v = e.target.value
          onMaxPriceChange(v === '' ? null : Number(v))
        }}
      />
    </div>
  )
}
