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
  // TODO: render status-filter and category-filter <select>s wired to the callbacks.
  void categories
  void statusFilter
  void categoryFilter
  void onStatusChange
  void onCategoryChange
  return <div data-testid="filters" />
}
