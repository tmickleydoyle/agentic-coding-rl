'use client'
import { useApp } from '../../components/AppStateProvider'
import { useBuilds } from '../../hooks/useBuilds'
import type { StatusFilter } from '../../lib/types'

export default function BuildsPage() {
  const { statusFilter, setStatusFilter } = useApp()
  const { filtered } = useBuilds()

  return (
    <section data-testid="page-builds">
      <h1>Builds</h1>
      <select
        data-testid="status-filter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
      >
        <option value="all">All</option>
        <option value="passing">Passing</option>
        <option value="failing">Failing</option>
        <option value="running">Running</option>
      </select>
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No builds match this filter.</p>
      ) : (
        <ul data-testid="all-build-list">
          {filtered.map((b) => (
            <li key={b.id} data-testid={`row-${b.id}`} data-status={b.status}>
              <span data-testid={`row-${b.id}-number`}>{b.number}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
