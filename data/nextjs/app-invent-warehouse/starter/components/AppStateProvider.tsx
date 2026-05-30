'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Bin, Route, Theme } from '../lib/types'

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

const STUB: WarehouseApi = {
  bins: [],
  theme: 'light',
  route: 'bins',
  selectedId: null,
  lastError: null,
  move: () => false,
  selectBin: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold bins/theme/route/selectedId/lastError in state (seed 3 bins), implement
  // move (via moveItem)/selectBin and the rest, and provide them through WarehouseContext.
  // The STUB below makes the app mount but does nothing.
  return <WarehouseContext.Provider value={STUB}>{children}</WarehouseContext.Provider>
}

export function useWarehouse(): WarehouseApi {
  const v = useContext(WarehouseContext)
  if (!v) throw new Error('useWarehouse must be used within an AppStateProvider')
  return v
}
