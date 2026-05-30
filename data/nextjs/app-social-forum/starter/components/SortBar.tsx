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
  // TODO: render sort-select (votes/recent) and category-filter (all + per category).
  void categories
  void sort
  void categoryFilter
  void onSortChange
  void onCategoryChange
  return <div data-testid="sort-bar" />
}
