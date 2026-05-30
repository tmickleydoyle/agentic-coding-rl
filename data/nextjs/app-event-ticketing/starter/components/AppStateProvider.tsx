'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AppApi = {
  events: [],
  orders: [],
  theme: 'light',
  route: 'events',
  selectedEventId: null,
  selectEvent: () => {},
  remaining: () => 0,
  isSoldOut: () => false,
  buy: () => false,
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold events/orders/theme/route/selectedEventId in state (seed 2 events + 1 order),
  // implement selectEvent/remaining/isSoldOut/buy/navigate, and provide them through
  // AppContext. The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
