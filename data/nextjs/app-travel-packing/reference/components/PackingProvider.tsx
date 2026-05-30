'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Category, Item, Route, Theme, Trip } from '../lib/types'

type NewItemInput = {
  tripId: string
  name: string
  category: Category
}

type PackingApi = {
  trips: Trip[]
  items: Item[]
  theme: Theme
  route: Route
  selectedTripId: string | null
  addItem: (input: NewItemInput) => void
  togglePacked: (id: string) => void
  removeItem: (id: string) => void
  selectTrip: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const PackingContext = createContext<PackingApi | null>(null)

const SEED_TRIPS: Trip[] = [
  { id: 'tr1', name: 'Beach Weekend' },
  { id: 'tr2', name: 'Ski Trip' },
]

const SEED_ITEMS: Item[] = [
  { id: 'i1', tripId: 'tr1', name: 'Swimsuit', category: 'clothing', packed: true },
  { id: 'i2', tripId: 'tr1', name: 'Sunscreen', category: 'toiletries', packed: false },
  { id: 'i3', tripId: 'tr1', name: 'Passport', category: 'documents', packed: false },
  { id: 'i4', tripId: 'tr2', name: 'Gloves', category: 'clothing', packed: false },
]

export function PackingProvider({ children }: { children: ReactNode }) {
  const [trips] = useState<Trip[]>(SEED_TRIPS)
  const [items, setItems] = useState<Item[]>(SEED_ITEMS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('trips')
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(5)

  const value = useMemo<PackingApi>(() => {
    const addItem = (input: NewItemInput) => {
      const id = `i${nextId}`
      setNextId((n) => n + 1)
      setItems((prev) => [
        ...prev,
        {
          id,
          tripId: input.tripId,
          name: input.name,
          category: input.category,
          packed: false,
        },
      ])
    }

    const togglePacked = (id: string) => {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, packed: !i.packed } : i)))
    }

    const removeItem = (id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }

    const selectTrip = (id: string) => {
      setSelectedTripId(id)
      setRoute('list')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      trips,
      items,
      theme,
      route,
      selectedTripId,
      addItem,
      togglePacked,
      removeItem,
      selectTrip,
      setTheme,
      navigate,
    }
  }, [trips, items, theme, route, selectedTripId, nextId])

  return <PackingContext.Provider value={value}>{children}</PackingContext.Provider>
}

export function usePacking(): PackingApi {
  const v = useContext(PackingContext)
  if (!v) throw new Error('usePacking must be used within a PackingProvider')
  return v
}
