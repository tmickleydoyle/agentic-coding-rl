'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Holding, Route, Theme } from '../lib/types'

type NewHoldingInput = {
  symbol: string
  name: string
  shares: number
  costBasis: number
  price: number
}

type PortfolioApi = {
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

const PortfolioContext = createContext<PortfolioApi | null>(null)

const STUB: PortfolioApi = {
  holdings: [],
  theme: 'light',
  route: 'portfolio',
  selectedHoldingId: null,
  addHolding: () => {},
  removeHolding: () => {},
  selectHolding: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  // TODO: hold holdings/theme/route/selectedHoldingId in state (seed 3 holdings), implement
  // the actions, and provide them through PortfolioContext. The STUB below makes the app
  // mount but does nothing — replace it with real state + actions.
  return <PortfolioContext.Provider value={STUB}>{children}</PortfolioContext.Provider>
}

export function usePortfolio(): PortfolioApi {
  const v = useContext(PortfolioContext)
  if (!v) throw new Error('usePortfolio must be used within a PortfolioProvider')
  return v
}
