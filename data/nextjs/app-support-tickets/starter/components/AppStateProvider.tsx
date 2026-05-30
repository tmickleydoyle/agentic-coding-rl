'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type {
  AssigneeFilter,
  Priority,
  PriorityFilter,
  Route,
  StatusFilter,
  Theme,
  Ticket,
  TicketStatus,
} from '../lib/types'

type NewTicketInput = {
  subject: string
  requester: string
  priority: Priority
}

type AppApi = {
  tickets: Ticket[]
  theme: Theme
  route: Route
  selectedTicketId: string | null
  statusFilter: StatusFilter
  priorityFilter: PriorityFilter
  assigneeFilter: AssigneeFilter
  addTicket: (input: NewTicketInput) => void
  assign: (id: string, assignee: string | null) => void
  setStatus: (id: string, status: TicketStatus) => void
  reply: (id: string, author: string, body: string) => void
  selectTicket: (id: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setPriorityFilter: (filter: PriorityFilter) => void
  setAssigneeFilter: (filter: AssigneeFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  tickets: [],
  theme: 'light',
  route: 'tickets',
  selectedTicketId: null,
  statusFilter: 'all',
  priorityFilter: 'all',
  assigneeFilter: 'all',
  addTicket: () => {},
  assign: () => {},
  setStatus: () => {},
  reply: () => {},
  selectTicket: () => {},
  setStatusFilter: () => {},
  setPriorityFilter: () => {},
  setAssigneeFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold tickets/theme/route/selection/filters in state (seed 4 tickets), implement the
  // actions (addTicket/assign/setStatus/reply/selectTicket/navigate/filters/theme), and
  // provide them through AppContext. The STUB below makes the app mount but does nothing —
  // replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
