'use client'
import type { Issue } from '../lib/types'

export default function IssueRow({
  issue,
  onOpen,
}: {
  issue: Issue
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`issue-${issue.id}`} data-priority={issue.priority}>
      <span data-testid={`issue-${issue.id}-title`}>{issue.title}</span>
      <span data-testid={`issue-${issue.id}-assignee`}>
        {issue.assignee ?? 'Unassigned'}
      </span>
      <button data-testid={`open-${issue.id}`} onClick={() => onOpen(issue.id)}>
        Open
      </button>
    </li>
  )
}
