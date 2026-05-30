'use client'
import { useApp } from '../components/AppStateProvider'
import type { Order } from '../lib/types'

export function useOrders() {
  // TODO: derive ordersForEvent(eventId), ticketCount (sum qty), and revenue (sum total)
  // from the shared orders state.
  useApp()
  const ordersForEvent = (_eventId: string): Order[] => []
  const ticketCount = 0
  const revenue = 0
  return { ordersForEvent, ticketCount, revenue }
}
