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

export function countIssues(issues: Issue[]): IssueCounts {
  const byPriority: Record<Priority, number> = { low: 0, medium: 0, high: 0 }
  const byLabel: Record<string, number> = {}
  let open = 0
  let inProgress = 0
  let closed = 0
  issues.forEach((i) => {
    if (i.status === 'open') open += 1
    else if (i.status === 'in-progress') inProgress += 1
    else closed += 1
    byPriority[i.priority] += 1
    i.labels.forEach((l) => {
      byLabel[l] = (byLabel[l] ?? 0) + 1
    })
  })
  return { total: issues.length, open, inProgress, closed, byPriority, byLabel }
}

export function allLabels(issues: Issue[]): string[] {
  const set: Record<string, true> = {}
  issues.forEach((i) => {
    i.labels.forEach((l) => {
      set[l] = true
    })
  })
  return Object.keys(set).sort()
}

export function filterIssues(
  issues: Issue[],
  labelFilter: LabelFilter,
  priorityFilter: PriorityFilter,
  assigneeFilter: AssigneeFilter,
): Issue[] {
  return issues.filter((i) => {
    if (labelFilter !== 'all' && i.labels.indexOf(labelFilter) === -1) return false
    if (priorityFilter !== 'all' && i.priority !== priorityFilter) return false
    if (assigneeFilter === 'unassigned' && i.assignee !== null) return false
    if (assigneeFilter !== 'all' && assigneeFilter !== 'unassigned' && i.assignee !== assigneeFilter) {
      return false
    }
    return true
  })
}

export function useIssues() {
  const { issues, labelFilter, priorityFilter, assigneeFilter } = useApp()
  const counts = countIssues(issues)
  const filtered = filterIssues(issues, labelFilter, priorityFilter, assigneeFilter)
  const labels = allLabels(issues)
  return { counts, filtered, labels }
}
