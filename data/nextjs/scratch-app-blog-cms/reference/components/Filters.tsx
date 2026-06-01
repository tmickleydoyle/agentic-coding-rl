'use client'
import type { Category, CategoryFilter, StatusFilter } from '../lib/types'

export default function Filters({
  categories,
  statusFilter,
  categoryFilter,
  onStatusChange,
  onCategoryChange,
}: {
  categories: Category[]
  statusFilter: StatusFilter
  categoryFilter: CategoryFilter
  onStatusChange: (filter: StatusFilter) => void
  onCategoryChange: (filter: CategoryFilter) => void
}) {
  return (
    <div data-testid="filters">
      <label htmlFor="status-filter">Status</label>
      <select
        id="status-filter"
        data-testid="status-filter"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
      >
        <option value="all">All</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
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
