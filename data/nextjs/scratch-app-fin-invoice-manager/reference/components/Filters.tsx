'use client'
import { STATUSES, type StatusFilter } from '../lib/types'

export default function Filters({
  statusFilter,
  onStatusChange,
}: {
  statusFilter: StatusFilter
  onStatusChange: (filter: StatusFilter) => void
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
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  )
}
