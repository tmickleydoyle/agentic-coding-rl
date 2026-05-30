'use client'
import { useApp } from '../components/AppStateProvider'
import type { Ticket } from '../lib/types'

export type SlaCounts = {
  total: number
  breached: number
  responded: number
  escalated: number
}

export function countSla(_tickets: Ticket[]): SlaCounts {
  // TODO: count total/breached/responded/escalated
  return { total: 0, breached: 0, responded: 0, escalated: 0 }
}

export function breachedTickets(_tickets: Ticket[]): Ticket[] {
  // TODO: return only currently-breached tickets
  return []
}

export function useSla() {
  const { tickets } = useApp()
  void tickets
  return {
    counts: { total: 0, breached: 0, responded: 0, escalated: 0 } as SlaCounts,
    breaches: [] as Ticket[],
  }
}
