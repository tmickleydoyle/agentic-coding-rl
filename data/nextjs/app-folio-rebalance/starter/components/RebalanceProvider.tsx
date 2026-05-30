'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Holding, RebalanceEntry, Route, Theme } from '../lib/types'

type NewHoldingInput = {
  symbol: string
  name: string
  value: number
  targetPercent: number
}

type RebalanceApi = {
  holdings: Holding[]
  history: RebalanceEntry[]
  theme: Theme
  route: Route
  selectedHoldingId: string | null
  addHolding: (input: NewHoldingInput) => void
  removeHolding: (id: string) => void
  setTarget: (id: string, targetPercent: number) => void
  selectHolding: (id: string) => void
  logRebalance: (entries: { symbol: string; action: 'BUY' | 'SELL'; amount: number }[]) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const RebalanceContext = createContext<RebalanceApi | null>(null)

const STUB: RebalanceApi = {
  holdings: [],
  history: [],
  theme: 'light',
  route: 'portfolio',
  selectedHoldingId: null,
  addHolding: () => {},
  removeHolding: () => {},
  setTarget: () => {},
  selectHolding: () => {},
  logRebalance: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function RebalanceProvider({ children }: { children: ReactNode }) {
  // TODO: hold holdings/history/theme/route/selectedHoldingId in state (seed 3 holdings + 2
  // history entries), implement the actions, and provide them through RebalanceContext. The
  // STUB below makes the app mount but does nothing — replace it with real state + actions.
  return <RebalanceContext.Provider value={STUB}>{children}</RebalanceContext.Provider>
}

export function useRebalance(): RebalanceApi {
  const v = useContext(RebalanceContext)
  if (!v) throw new Error('useRebalance must be used within a RebalanceProvider')
  return v
}
