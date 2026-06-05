'use client'
import type { Category, CategoryFilter, Sort } from '../lib/types'

export default function SortBar({
  categories,
  sort,
  categoryFilter,
  onSortChange,
  onCategoryChange,
}: {
  categories: Category[]
  sort: Sort
  categoryFilter: CategoryFilter
  onSortChange: (sort: Sort) => void
  onCategoryChange: (filter: CategoryFilter) => void
}) {
  return (
    <div data-testid="sort-bar">
      <label htmlFor="sort-select">Sort</label>
      <select
        id="sort-select"
        data-testid="sort-select"
        value={sort}
        onChange={(e) => onSortChange(e.target.value as Sort)}
      >
        <option value="votes">Top</option>
        <option value="recent">Recent</option>
      </select>

      <label htmlFor="category-filter">Category</label>
      <select
        id="category-filter"
        data-testid="category-filter"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="all">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  )
}
