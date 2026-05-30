'use client'
import { useApp } from '../components/AppStateProvider'
import type { AssigneeFilter, PriorityFilter, StatusFilter, Ticket } from '../lib/types'

export type TicketCounts = {
  total: number
  open: number
  pending: number
  resolved: number
}

export function countTickets(_tickets: Ticket[]): TicketCounts {
  // TODO: count tickets by status
  return { total: 0, open: 0, pending: 0, resolved: 0 }
}

export function filterTickets(
  _tickets: Ticket[],
  _statusFilter: StatusFilter,
  _priorityFilter: PriorityFilter,
  _assigneeFilter: AssigneeFilter,
): Ticket[] {
  // TODO: apply the three filters
  return []
}

export function useTickets() {
  const { tickets, statusFilter, priorityFilter, assigneeFilter } = useApp()
  // TODO: derive counts, the filtered list, and the distinct assignee names
  void tickets
  void statusFilter
  void priorityFilter
  void assigneeFilter
  return {
    counts: { total: 0, open: 0, pending: 0, resolved: 0 } as TicketCounts,
    filtered: [] as Ticket[],
    assignees: [] as string[],
  }
}
