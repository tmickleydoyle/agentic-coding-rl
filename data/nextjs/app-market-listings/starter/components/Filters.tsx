'use client'
import type { CategoryFilter } from '../lib/types'

export default function Filters(_props: {
  categoryFilter: CategoryFilter
  onCategoryChange: (filter: CategoryFilter) => void
}) {
  // TODO: render a category-filter <select> with an "all" option plus one per category.
  return <div data-testid="filters" />
}
