'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Holding, Route, Theme } from '../lib/types'

type NewHoldingInput = {
  symbol: string
  name: string
  shares: number
  dividendPerShare: number
  payMonth: number
}

type DividendsApi = {
  holdings: Holding[]
  theme: Theme
  route: Route
  selectedHoldingId: string | null
  addHolding: (input: NewHoldingInput) => void
  removeHolding: (id: string) => void
  selectHolding: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const DividendsContext = createContext<DividendsApi | null>(null)

const STUB: DividendsApi = {
  holdings: [],
  theme: 'light',
  route: 'dashboard',
  selectedHoldingId: null,
  addHolding: () => {},
  removeHolding: () => {},
  selectHolding: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function DividendsProvider({ children }: { children: ReactNode }) {
  // TODO: hold holdings/theme/route/selectedHoldingId in state (seed 4 holdings), implement
  // the actions, and provide them through DividendsContext. The STUB below makes the app
  // mount but does nothing — replace it with real state + actions.
  return <DividendsContext.Provider value={STUB}>{children}</DividendsContext.Provider>
}

export function useDividends(): DividendsApi {
  const v = useContext(DividendsContext)
  if (!v) throw new Error('useDividends must be used within a DividendsProvider')
  return v
}
