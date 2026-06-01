'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Bin, Route, Theme } from '../lib/types'
import { moveItem } from '../lib/move'

type WarehouseApi = {
  bins: Bin[]
  theme: Theme
  route: Route
  selectedId: string | null
  lastError: string | null
  move: (fromId: string, toId: string, name: string, qty: number) => boolean
  selectBin: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const WarehouseContext = createContext<WarehouseApi | null>(null)

const SEED: Bin[] = [
  {
    id: 'b1',
    code: 'A1',
    capacity: 100,
    items: [
      { name: 'Bolts', qty: 40 },
      { name: 'Nuts', qty: 20 },
    ],
  },
  { id: 'b2', code: 'A2', capacity: 50, items: [{ name: 'Washers', qty: 50 }] },
  { id: 'b3', code: 'B1', capacity: 80, items: [] },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [bins, setBins] = useState<Bin[]>(SEED)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('bins')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)

  const value = useMemo<WarehouseApi>(() => {
    const move = (fromId: string, toId: string, name: string, qty: number): boolean => {
      const result = moveItem(bins, fromId, toId, name, qty)
      if (!result.ok) {
        setLastError(result.error)
        return false
      }
      setLastError(null)
      setBins(result.bins)
      return true
    }

    const selectBin = (id: string) => {
      setSelectedId(id)
      setRoute('bin-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return { bins, theme, route, selectedId, lastError, move, selectBin, setTheme, navigate }
  }, [bins, theme, route, selectedId, lastError])

  return <WarehouseContext.Provider value={value}>{children}</WarehouseContext.Provider>
}

export function useWarehouse(): WarehouseApi {
  const v = useContext(WarehouseContext)
  if (!v) throw new Error('useWarehouse must be used within an AppStateProvider')
  return v
}
