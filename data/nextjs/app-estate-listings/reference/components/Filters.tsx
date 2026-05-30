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
  return (
    <div data-testid="filters">
      <label htmlFor="type-filter">Type</label>
      <select
        id="type-filter"
        data-testid="type-filter"
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value as TypeFilter)}
      >
        <option value="all">All types</option>
        <option value="house">House</option>
        <option value="condo">Condo</option>
        <option value="townhouse">Townhouse</option>
      </select>

      <label htmlFor="beds-filter">Min beds</label>
      <select
        id="beds-filter"
        data-testid="beds-filter"
        value={bedsFilter === 'all' ? 'all' : String(bedsFilter)}
        onChange={(e) =>
          onBedsChange(e.target.value === 'all' ? 'all' : Number(e.target.value))
        }
      >
        <option value="all">Any beds</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>

      <label htmlFor="max-price">Max price</label>
      <input
        id="max-price"
        data-testid="max-price"
        value={maxPrice == null ? '' : String(maxPrice)}
        onChange={(e) => {
          const v = e.target.value.trim()
          onMaxPriceChange(v === '' ? null : Number(v))
        }}
      />
    </div>
  )
}
