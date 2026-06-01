'use client'
import { useApp } from '../components/AppStateProvider'
import type { AssigneeFilter, PriorityFilter, StatusFilter, Ticket } from '../lib/types'

export type TicketCounts = {
  total: number
  open: number
  pending: number
  resolved: number
}

export function countTickets(tickets: Ticket[]): TicketCounts {
  let open = 0
  let pending = 0
  let resolved = 0
  tickets.forEach((t) => {
    if (t.status === 'open') open += 1
    else if (t.status === 'pending') pending += 1
    else if (t.status === 'resolved') resolved += 1
  })
  return { total: tickets.length, open, pending, resolved }
}

export function filterTickets(
  tickets: Ticket[],
  statusFilter: StatusFilter,
  priorityFilter: PriorityFilter,
  assigneeFilter: AssigneeFilter,
): Ticket[] {
  return tickets.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
    if (assigneeFilter === 'unassigned') {
      if (t.assignee !== null) return false
    } else if (assigneeFilter !== 'all' && t.assignee !== assigneeFilter) {
      return false
    }
    return true
  })
}

export function useTickets() {
  const { tickets, statusFilter, priorityFilter, assigneeFilter } = useApp()
  const counts = countTickets(tickets)
  const filtered = filterTickets(tickets, statusFilter, priorityFilter, assigneeFilter)
  const assignees: string[] = []
  tickets.forEach((t) => {
    if (t.assignee && assignees.indexOf(t.assignee) === -1) assignees.push(t.assignee)
  })
  assignees.sort()
  return { counts, filtered, assignees }
}
