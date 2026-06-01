'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import type { Priority } from '../../lib/types'

export default function IssueDetailPage() {
  const { issues, selectedIssueId, assign, setPriority } = useApp()
  const [assigneeInput, setAssigneeInput] = useState('')

  if (!selectedIssueId) {
    return (
      <section data-testid="page-issue-detail">
        <p data-testid="no-selection">No issue selected.</p>
      </section>
    )
  }

  const issue = issues.find((i) => i.id === selectedIssueId)
  if (!issue) {
    return (
      <section data-testid="page-issue-detail">
        <p data-testid="no-selection">No issue selected.</p>
      </section>
    )
  }

  const onAssign = () => {
    const trimmed = assigneeInput.trim()
    assign(issue.id, trimmed.length > 0 ? trimmed : null)
    setAssigneeInput('')
  }

  return (
    <section data-testid="page-issue-detail">
      <h1 data-testid="detail-title">{issue.title}</h1>
      <ul data-testid="detail-labels">
        {issue.labels.map((l) => (
          <li key={l} data-testid={`label-${l}`}>
            {l}
          </li>
        ))}
      </ul>
      <p data-testid="detail-priority">{issue.priority}</p>
      <p data-testid="detail-assignee">{issue.assignee ?? 'Unassigned'}</p>

      <input
        data-testid="assignee-input"
        value={assigneeInput}
        onChange={(e) => setAssigneeInput(e.target.value)}
      />
      <button data-testid="assign-btn" onClick={onAssign}>
        Assign
      </button>

      <select
        data-testid="priority-select"
        value={issue.priority}
        onChange={(e) => setPriority(issue.id, e.target.value as Priority)}
      >
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
      </select>
    </section>
  )
}
