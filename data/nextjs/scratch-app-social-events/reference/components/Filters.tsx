'use client'
import type { TimeFilter } from '../lib/types'

export default function Filters({
  timeFilter,
  onTimeChange,
}: {
  timeFilter: TimeFilter
  onTimeChange: (filter: TimeFilter) => void
}) {
  return (
    <div data-testid="filters">
      <label htmlFor="time-filter">When</label>
      <select
        id="time-filter"
        data-testid="time-filter"
        value={timeFilter}
        onChange={(e) => onTimeChange(e.target.value as TimeFilter)}
      >
        <option value="all">All</option>
        <option value="upcoming">Upcoming</option>
        <option value="past">Past</option>
      </select>
    </div>
  )
}
