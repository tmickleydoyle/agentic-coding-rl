'use client'
import type { BedsFilter, TypeFilter } from '../lib/types'

export default function Filters({
  typeFilter,
  bedsFilter,
  maxPrice,
  onTypeChange,
  onBedsChange,
  onMaxPriceChange,
}: {
  typeFilter: TypeFilter
  bedsFilter: BedsFilter
  maxPrice: number | null
  onTypeChange: (filter: TypeFilter) => void
  onBedsChange: (filter: BedsFilter) => void
  onMaxPriceChange: (price: number | null) => void
}) {
  // TODO: render type-filter and beds-filter <select>s and a max-price <input> wired to
  // the callbacks.
  void typeFilter
  void bedsFilter
  void maxPrice
  void onTypeChange
  void onBedsChange
  void onMaxPriceChange
  return <div data-testid="filters" />
}
