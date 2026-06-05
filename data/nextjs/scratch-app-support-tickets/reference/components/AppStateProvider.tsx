'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type {
  AssigneeFilter,
  Priority,
  PriorityFilter,
  Reply,
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

const SEED_TICKETS: Ticket[] = [
  {
    id: 'k1',
    subject: 'Cannot log in',
    requester: 'dana',
    priority: 'high',
    status: 'open',
    assignee: 'alice',
    replies: [{ id: 'r1', author: 'alice', body: 'Looking into it.' }],
  },
  {
    id: 'k2',
    subject: 'Billing question',
    requester: 'evan',
    priority: 'normal',
    status: 'pending',
    assignee: null,
    replies: [],
  },
  {
    id: 'k3',
    subject: 'Feature request: dark mode',
    requester: 'fran',
    priority: 'low',
    status: 'open',
    assignee: 'bob',
    replies: [],
  },
  {
    id: 'k4',
    subject: 'Payment failed',
    requester: 'gita',
    priority: 'urgent',
    status: 'resolved',
    assignee: 'alice',
    replies: [{ id: 'r2', author: 'alice', body: 'Refunded.' }],
  },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(SEED_TICKETS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('tickets')
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>('all')
  const [nextId, setNextId] = useState(5)
  const [nextReplyId, setNextReplyId] = useState(3)

  const value = useMemo<AppApi>(() => {
    const addTicket = (input: NewTicketInput) => {
      const id = `k${nextId}`
      setNextId((n) => n + 1)
      setTickets((prev) => [
        ...prev,
        {
          id,
          subject: input.subject,
          requester: input.requester,
          priority: input.priority,
          status: 'open',
          assignee: null,
          replies: [],
        },
      ])
    }
    const assign = (id: string, assignee: string | null) => {
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, assignee } : t)))
    }
    const setStatus = (id: string, status: TicketStatus) => {
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
    }
    const reply = (id: string, author: string, body: string) => {
      const rid = `r${nextReplyId}`
      setNextReplyId((n) => n + 1)
      const r: Reply = { id: rid, author, body }
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, replies: [...t.replies, r] } : t)),
      )
    }
    const selectTicket = (id: string) => {
      setSelectedTicketId(id)
      setRoute('ticket-detail')
    }
    const navigate = (next: Route) => setRoute(next)

    return {
      tickets,
      theme,
      route,
      selectedTicketId,
      statusFilter,
      priorityFilter,
      assigneeFilter,
      addTicket,
      assign,
      setStatus,
      reply,
      selectTicket,
      setStatusFilter,
      setPriorityFilter,
      setAssigneeFilter,
      setTheme,
      navigate,
    }
  }, [tickets, theme, route, selectedTicketId, statusFilter, priorityFilter, assigneeFilter, nextId, nextReplyId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
