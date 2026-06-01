'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Destination, Route, Theme } from '../lib/types'

type NewDestinationInput = {
  name: string
  country: string
  continent: string
  notes?: string
}

type AppApi = {
  destinations: Destination[]
  theme: Theme
  route: Route
  continentFilter: string
  selectedId: string | null
  addDestination: (input: NewDestinationInput) => void
  toggleVisited: (id: string) => void
  setContinentFilter: (c: string) => void
  selectDestination: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_DESTINATIONS: Destination[] = [
  { id: 'd1', name: 'Kyoto', country: 'Japan', continent: 'Asia', visited: true, notes: 'Temples' },
  { id: 'd2', name: 'Patagonia', country: 'Argentina', continent: 'South America', visited: false, notes: 'Hiking' },
  { id: 'd3', name: 'Reykjavik', country: 'Iceland', continent: 'Europe', visited: false, notes: 'Northern lights' },
  { id: 'd4', name: 'Cairo', country: 'Egypt', continent: 'Africa', visited: true, notes: 'Pyramids' },
  { id: 'd5', name: 'Lisbon', country: 'Portugal', continent: 'Europe', visited: false, notes: 'Trams' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [destinations, setDestinations] = useState<Destination[]>(SEED_DESTINATIONS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('list')
  const [continentFilter, setContinentFilter] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(6)

  const value = useMemo<AppApi>(() => {
    const addDestination = (input: NewDestinationInput) => {
      const id = `d${nextId}`
      setNextId((n) => n + 1)
      setDestinations((prev) => [
        ...prev,
        {
          id,
          name: input.name,
          country: input.country,
          continent: input.continent,
          visited: false,
          notes: input.notes ?? '',
        },
      ])
    }
    const toggleVisited = (id: string) => {
      setDestinations((prev) => prev.map((d) => (d.id === id ? { ...d, visited: !d.visited } : d)))
    }
    const navigate = (next: Route) => setRoute(next)
    const selectDestination = (id: string) => {
      setSelectedId(id)
      setRoute('destination-detail')
    }
    return {
      destinations,
      theme,
      route,
      continentFilter,
      selectedId,
      addDestination,
      toggleVisited,
      setContinentFilter,
      selectDestination,
      setTheme,
      navigate,
    }
  }, [destinations, theme, route, continentFilter, selectedId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
