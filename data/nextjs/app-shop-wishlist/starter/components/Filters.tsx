'use client'
import type { CategoryFilter, Product } from '../lib/types'

export default function Filters(_props: {
  products: Product[]
  categoryFilter: CategoryFilter
  maxPrice: number | null
  onCategoryChange: (filter: CategoryFilter) => void
  onMaxPriceChange: (value: number | null) => void
}) {
  // TODO: render category-filter select (all + one per category) and a max-price number input.
  return <div data-testid="filters" />
}
