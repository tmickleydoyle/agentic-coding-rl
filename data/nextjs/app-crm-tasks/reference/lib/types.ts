export type Contact = {
  id: string
  name: string
}

export type FollowUp = {
  id: string
  title: string
  contactId: string
  dueDate: string
  done: boolean
}

export type Route = 'today' | 'tasks' | 'contacts' | 'done'
export type Theme = 'light' | 'dark'

// Fixed "today" used throughout so date logic is deterministic in tests.
export const TODAY = '2026-06-01'
