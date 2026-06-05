'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Item, Offer, Route, StatusFilter, Theme } from '../lib/types'
import { ME } from '../lib/types'

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

const SEED_ITEMS: Item[] = [
  { id: 'i1', name: 'Skateboard', owner: 'nina' },
  { id: 'i2', name: 'Guitar', owner: 'me' },
  { id: 'i3', name: 'Camera lens', owner: 'omar' },
]

const SEED_OFFERS: Offer[] = [
  { id: 'of1', itemId: 'i2', offeredBy: 'tom', give: 'Headphones', status: 'pending' },
  { id: 'of2', itemId: 'i2', offeredBy: 'uma', give: 'Books', status: 'accepted' },
  { id: 'of3', itemId: 'i1', offeredBy: 'me', give: 'Old phone', status: 'pending' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [items] = useState<Item[]>(SEED_ITEMS)
  const [offers, setOffers] = useState<Offer[]>(SEED_OFFERS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('items')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const select = (id: string) => {
      setSelectedId(id)
      setRoute('detail')
    }

    const propose = (itemId: string, give: string): boolean => {
      if (give.trim().length === 0) return false
      const id = `of${nextId}`
      setNextId((n) => n + 1)
      setOffers((prev) => [
        ...prev,
        { id, itemId, offeredBy: ME, give: give.trim(), status: 'pending' },
      ])
      return true
    }

    const accept = (id: string) => {
      setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'accepted' } : o)))
    }

    const decline = (id: string) => {
      setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'declined' } : o)))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      items,
      offers,
      theme,
      route,
      statusFilter,
      selectedId,
      select,
      propose,
      accept,
      decline,
      setStatusFilter,
      setTheme,
      navigate,
    }
  }, [items, offers, theme, route, statusFilter, selectedId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
