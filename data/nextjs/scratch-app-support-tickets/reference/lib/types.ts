export type Priority = 'low' | 'normal' | 'high' | 'urgent'
export type TicketStatus = 'open' | 'pending' | 'resolved'

export type Reply = {
  id: string
  author: string
  body: string
}

export type Ticket = {
  id: string
  subject: string
  requester: string
  priority: Priority
  status: TicketStatus
  assignee: string | null
  replies: Reply[]
}

export type StatusFilter = 'all' | TicketStatus
export type PriorityFilter = 'all' | Priority
export type AssigneeFilter = 'all' | 'unassigned' | string

export type Route = 'tickets' | 'ticket-detail' | 'new' | 'queue'
export type Theme = 'light' | 'dark'
