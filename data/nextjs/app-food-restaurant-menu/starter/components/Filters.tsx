'use client'
import type { CategoryFilter } from '../lib/types'

export default function Filters(_props: {
  categories: string[]
  categoryFilter: CategoryFilter
  vegOnly: boolean
  onCategoryChange: (filter: CategoryFilter) => void
  onVegOnlyChange: (value: boolean) => void
}) {
  // TODO: render a category-filter <select> (all + per-category) and a veg-only checkbox.
  return <div data-testid="filters" />
}
