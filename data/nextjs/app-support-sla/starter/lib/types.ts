export type Priority = 'low' | 'normal' | 'high' | 'urgent'

export type Ticket = {
  id: string
  subject: string
  priority: Priority
  slaMinutes: number
  elapsedMinutes: number
  responded: boolean
  escalated: boolean
}

export type Route = 'tickets' | 'ticket-detail' | 'breaches' | 'dashboard'
export type Theme = 'light' | 'dark'

export function isBreached(t: Ticket): boolean {
  return !t.responded && t.elapsedMinutes > t.slaMinutes
}

export function remainingMinutes(t: Ticket): number {
  return t.slaMinutes - t.elapsedMinutes
}

const ORDER: Priority[] = ['low', 'normal', 'high', 'urgent']

export function bumpPriority(p: Priority): Priority {
  const idx = ORDER.indexOf(p)
  if (idx === -1 || idx === ORDER.length - 1) return p
  return ORDER[idx + 1]
}
