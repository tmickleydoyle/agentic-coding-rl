'use client'
import type { Issue } from '../lib/types'

export default function IssueRow({
  issue,
  onOpen,
}: {
  issue: Issue
  onOpen: (id: string) => void
}) {
  // TODO: render <li data-testid="issue-<id>" data-priority> with title, assignee text
  // (Unassigned when null), and an open-<id> button that calls onOpen(issue.id).
  void onOpen
  return <li data-testid={`issue-${issue.id}`} />
}
