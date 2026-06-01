'use client'
import type { CategoryFilter } from '../lib/types'

export default function Filters({
  categories,
  categoryFilter,
  vegOnly,
  onCategoryChange,
  onVegOnlyChange,
}: {
  categories: string[]
  categoryFilter: CategoryFilter
  vegOnly: boolean
  onCategoryChange: (filter: CategoryFilter) => void
  onVegOnlyChange: (value: boolean) => void
}) {
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

      <label htmlFor="veg-only">Vegetarian only</label>
      <input
        id="veg-only"
        type="checkbox"
        data-testid="veg-only"
        checked={vegOnly}
        onChange={(e) => onVegOnlyChange(e.target.checked)}
      />
    </div>
  )
}
