'use client'
import { useApp } from '../components/AppStateProvider'
import type { Ticket } from '../lib/types'
import { isBreached } from '../lib/types'

export type SlaCounts = {
  total: number
  breached: number
  responded: number
  escalated: number
}

export function countSla(tickets: Ticket[]): SlaCounts {
  let breached = 0
  let responded = 0
  let escalated = 0
  tickets.forEach((t) => {
    if (isBreached(t)) breached += 1
    if (t.responded) responded += 1
    if (t.escalated) escalated += 1
  })
  return { total: tickets.length, breached, responded, escalated }
}

export function breachedTickets(tickets: Ticket[]): Ticket[] {
  return tickets.filter((t) => isBreached(t))
}

export function useSla() {
  const { tickets } = useApp()
  const counts = countSla(tickets)
  const breaches = breachedTickets(tickets)
  return { counts, breaches }
}
