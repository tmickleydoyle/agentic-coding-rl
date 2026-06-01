'use client'
import type { CategoryFilter } from '../lib/types'
import { CATEGORIES } from '../lib/types'

export default function Filters({
  categoryFilter,
  onCategoryChange,
}: {
  categoryFilter: CategoryFilter
  onCategoryChange: (filter: CategoryFilter) => void
}) {
  return (
    <div data-testid="filters">
      <label htmlFor="category-filter">Category</label>
      <select
        id="category-filter"
        data-testid="category-filter"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
      >
        <option value="all">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  )
}
