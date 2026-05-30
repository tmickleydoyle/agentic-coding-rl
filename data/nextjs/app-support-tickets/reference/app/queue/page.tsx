'use client'
import { useApp } from '../../components/AppStateProvider'
import { useTickets } from '../../hooks/useTickets'
import StatCard from '../../components/StatCard'
import type { PriorityFilter, StatusFilter } from '../../lib/types'

export default function QueuePage() {
  const {
    statusFilter,
    priorityFilter,
    assigneeFilter,
    setStatusFilter,
    setPriorityFilter,
    setAssigneeFilter,
  } = useApp()
  const { counts, filtered, assignees } = useTickets()

  return (
    <section data-testid="page-queue">
      <h1>Queue</h1>
      <div data-testid="stats">
        <StatCard label="Total" value={counts.total} testid="total" />
        <StatCard label="Open" value={counts.open} testid="open" />
        <StatCard label="Pending" value={counts.pending} testid="pending" />
        <StatCard label="Resolved" value={counts.resolved} testid="resolved" />
      </div>

      <div data-testid="filters">
        <select
          data-testid="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="all">All statuses</option>
          <option value="open">open</option>
          <option value="pending">pending</option>
          <option value="resolved">resolved</option>
        </select>

        <select
          data-testid="priority-filter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
        >
          <option value="all">All priorities</option>
          <option value="low">low</option>
          <option value="normal">normal</option>
          <option value="high">high</option>
          <option value="urgent">urgent</option>
        </select>

        <select
          data-testid="assignee-filter"
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
        >
          <option value="all">All assignees</option>
          <option value="unassigned">Unassigned</option>
          {assignees.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p data-testid="empty-state">No tickets match these filters.</p>
      ) : (
        <ul data-testid="queue-list">
          {filtered.map((t) => (
            <li
              key={t.id}
              data-testid={`queue-${t.id}`}
              data-status={t.status}
              data-priority={t.priority}
            >
              <span data-testid={`queue-${t.id}-subject`}>{t.subject}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
