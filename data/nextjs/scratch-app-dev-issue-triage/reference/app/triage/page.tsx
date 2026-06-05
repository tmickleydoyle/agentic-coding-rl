'use client'
import { useApp } from '../../components/AppStateProvider'
import { useIssues } from '../../hooks/useIssues'
import type { AssigneeFilter, LabelFilter, PriorityFilter } from '../../lib/types'

export default function TriagePage() {
  const {
    issues,
    labelFilter,
    priorityFilter,
    assigneeFilter,
    setLabelFilter,
    setPriorityFilter,
    setAssigneeFilter,
  } = useApp()
  const { filtered, labels } = useIssues()

  const assignees: string[] = []
  issues.forEach((i) => {
    if (i.assignee && assignees.indexOf(i.assignee) === -1) assignees.push(i.assignee)
  })
  assignees.sort()

  return (
    <section data-testid="page-triage">
      <h1>Triage</h1>
      <div data-testid="filters">
        <select
          data-testid="label-filter"
          value={labelFilter}
          onChange={(e) => setLabelFilter(e.target.value as LabelFilter)}
        >
          <option value="all">All labels</option>
          {labels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <select
          data-testid="priority-filter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
        >
          <option value="all">All priorities</option>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>

        <select
          data-testid="assignee-filter"
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value as AssigneeFilter)}
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
        <p data-testid="empty-state">No issues match these filters.</p>
      ) : (
        <ul data-testid="triage-list">
          {filtered.map((i) => (
            <li key={i.id} data-testid={`triage-${i.id}`} data-priority={i.priority}>
              <span data-testid={`triage-${i.id}-title`}>{i.title}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
