'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Item, Offer, Route, StatusFilter, Theme } from '../lib/types'

type AppApi = {
  items: Item[]
  offers: Offer[]
  theme: Theme
  route: Route
  statusFilter: StatusFilter
  selectedId: string | null
  select: (id: string) => void
  propose: (itemId: string, give: string) => boolean
  accept: (id: string) => void
  decline: (id: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  items: [],
  offers: [],
  theme: 'light',
  route: 'items',
  statusFilter: 'all',
  selectedId: null,
  select: () => {},
  propose: () => false,
  accept: () => {},
  decline: () => {},
  setStatusFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold items/offers/theme/route/filter/selectedId in state (seed 3 items + 3 offers),
  // implement select, propose (blank give rejected), accept, decline, navigate. The STUB
  // below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
