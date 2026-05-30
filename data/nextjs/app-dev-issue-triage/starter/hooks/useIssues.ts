'use client'
import { useApp } from '../components/AppStateProvider'
import type { AssigneeFilter, Issue, LabelFilter, Priority, PriorityFilter } from '../lib/types'

export type IssueCounts = {
  total: number
  open: number
  inProgress: number
  closed: number
  byPriority: Record<Priority, number>
  byLabel: Record<string, number>
}

export function countIssues(_issues: Issue[]): IssueCounts {
  // TODO: compute total/open/inProgress/closed and per-priority + per-label counts
  return { total: 0, open: 0, inProgress: 0, closed: 0, byPriority: { low: 0, medium: 0, high: 0 }, byLabel: {} }
}

export function allLabels(_issues: Issue[]): string[] {
  // TODO: return the sorted set of all labels across issues
  return []
}

export function filterIssues(
  _issues: Issue[],
  _labelFilter: LabelFilter,
  _priorityFilter: PriorityFilter,
  _assigneeFilter: AssigneeFilter,
): Issue[] {
  // TODO: apply label + priority + assignee filters (unassigned matches null assignee)
  return []
}

export function useIssues() {
  const { issues, labelFilter, priorityFilter, assigneeFilter } = useApp()
  const counts = countIssues(issues)
  const filtered = filterIssues(issues, labelFilter, priorityFilter, assigneeFilter)
  const labels = allLabels(issues)
  return { counts, filtered, labels }
}
