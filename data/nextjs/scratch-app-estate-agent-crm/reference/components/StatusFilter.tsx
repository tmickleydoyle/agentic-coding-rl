'use client'
import type { StatusFilter as StatusFilterType } from '../lib/types'

export default function StatusFilter({
  value,
  onChange,
}: {
  value: StatusFilterType
  onChange: (v: StatusFilterType) => void
}) {
  return (
    <div data-testid="status-filter-wrap">
      <label htmlFor="status-filter">Status</label>
      <select
        id="status-filter"
        data-testid="status-filter"
        value={value}
        onChange={(e) => onChange(e.target.value as StatusFilterType)}
      >
        <option value="all">All</option>
        <option value="new">New</option>
        <option value="touring">Touring</option>
        <option value="offer">Offer</option>
        <option value="closed">Closed</option>
      </select>
    </div>
  )
}
