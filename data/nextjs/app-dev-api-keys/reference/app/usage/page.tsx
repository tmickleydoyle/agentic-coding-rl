'use client'
import { useApp } from '../../components/AppStateProvider'
import { useKeys } from '../../hooks/useKeys'
import StatCard from '../../components/StatCard'
import type { StatusFilter } from '../../lib/types'

export default function UsagePage() {
  const { statusFilter, setStatusFilter } = useApp()
  const { filtered } = useKeys()

  let totalUsage = 0
  filtered.forEach((k) => {
    totalUsage += k.usageCount
  })

  return (
    <section data-testid="page-usage">
      <h1>Usage</h1>
      <select
        data-testid="status-filter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="revoked">Revoked</option>
      </select>
      <StatCard label="Total usage" value={totalUsage} testid="total-usage" />
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No keys match this filter.</p>
      ) : (
        <ul data-testid="usage-list">
          {filtered.map((k) => (
            <li key={k.id} data-testid={`usage-${k.id}`} data-active={k.active ? 'true' : 'false'}>
              <span data-testid={`usage-${k.id}-name`}>{k.name}</span>
              <span data-testid={`usage-${k.id}-count`}>{k.usageCount}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
