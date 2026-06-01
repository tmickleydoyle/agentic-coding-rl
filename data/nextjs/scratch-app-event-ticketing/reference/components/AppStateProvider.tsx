'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { EventItem, Order, Route, Theme } from '../lib/types'

type BuyInput = {
  eventId: string
  tierId: string
  qty: number
  buyer: string
}

type AppApi = {
  events: EventItem[]
  orders: Order[]
  theme: Theme
  route: Route
  selectedEventId: string | null
  selectEvent: (id: string) => void
  remaining: (eventId: string, tierId: string) => number
  isSoldOut: (eventId: string, tierId: string) => boolean
  buy: (input: BuyInput) => boolean
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

function seedEvents(): EventItem[] {
  return [
    {
      id: 'e1',
      name: 'Synth Fest',
      date: '2026-07-01',
      venue: 'Hall A',
      tiers: [
        { id: 't1', name: 'GA', price: 50, capacity: 100, sold: 20 },
        { id: 't2', name: 'VIP', price: 120, capacity: 10, sold: 10 },
      ],
    },
    {
      id: 'e2',
      name: 'Code Camp',
      date: '2026-08-15',
      venue: 'Hall B',
      tiers: [{ id: 't3', name: 'GA', price: 30, capacity: 50, sold: 0 }],
    },
  ]
}

const SEED_ORDERS: Order[] = [
  { id: 'o1', eventId: 'e1', tierId: 't1', qty: 2, buyer: 'Ada', total: 100 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>(seedEvents)
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('events')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(2)

  const value = useMemo<AppApi>(() => {
    const findTier = (eventId: string, tierId: string) => {
      const event = events.find((e) => e.id === eventId)
      if (!event) return undefined
      return event.tiers.find((t) => t.id === tierId)
    }

    const remaining = (eventId: string, tierId: string): number => {
      const tier = findTier(eventId, tierId)
      if (!tier) return 0
      return tier.capacity - tier.sold
    }

    const isSoldOut = (eventId: string, tierId: string): boolean =>
      remaining(eventId, tierId) <= 0

    const selectEvent = (id: string) => {
      setSelectedEventId(id)
      setRoute('event-detail')
    }

    const buy = (input: BuyInput): boolean => {
      const tier = findTier(input.eventId, input.tierId)
      if (!tier) return false
      if (input.buyer.trim().length === 0) return false
      if (!Number.isInteger(input.qty) || input.qty <= 0) return false
      if (input.qty > tier.capacity - tier.sold) return false
      const id = `o${nextId}`
      setNextId((n) => n + 1)
      const total = tier.price * input.qty
      setEvents((prev) =>
        prev.map((e) =>
          e.id === input.eventId
            ? {
                ...e,
                tiers: e.tiers.map((t) =>
                  t.id === input.tierId ? { ...t, sold: t.sold + input.qty } : t,
                ),
              }
            : e,
        ),
      )
      setOrders((prev) => [
        ...prev,
        {
          id,
          eventId: input.eventId,
          tierId: input.tierId,
          qty: input.qty,
          buyer: input.buyer.trim(),
          total,
        },
      ])
      return true
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      events,
      orders,
      theme,
      route,
      selectedEventId,
      selectEvent,
      remaining,
      isSoldOut,
      buy,
      setTheme,
      navigate,
    }
  }, [events, orders, theme, route, selectedEventId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
