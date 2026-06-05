'use client'
import type { CuisineFilter } from '../lib/types'

export default function Filters({
  cuisines,
  cuisineFilter,
  onCuisineChange,
}: {
  cuisines: string[]
  cuisineFilter: CuisineFilter
  onCuisineChange: (filter: CuisineFilter) => void
}) {
  return (
    <div data-testid="filters">
      <label htmlFor="cuisine-filter">Cuisine</label>
      <select
        id="cuisine-filter"
        data-testid="cuisine-filter"
        value={cuisineFilter}
        onChange={(e) => onCuisineChange(e.target.value)}
      >
        <option value="all">All cuisines</option>
        {cuisines.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  )
}
