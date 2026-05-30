'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Coin, Route, Theme } from '../lib/types'

type NewCoinInput = {
  symbol: string
  name: string
  amount: number
  price: number
  change24h: number
}

type PortfolioApi = {
  coins: Coin[]
  theme: Theme
  route: Route
  selectedCoinId: string | null
  addCoin: (input: NewCoinInput) => void
  removeCoin: (id: string) => void
  selectCoin: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const PortfolioContext = createContext<PortfolioApi | null>(null)

const STUB: PortfolioApi = {
  coins: [],
  theme: 'light',
  route: 'portfolio',
  selectedCoinId: null,
  addCoin: () => {},
  removeCoin: () => {},
  selectCoin: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  // TODO: hold coins/theme/route/selectedCoinId in state (seed 3 coins), implement the
  // actions, and provide them through PortfolioContext. The STUB below makes the app mount
  // but does nothing — replace it with real state + actions.
  return <PortfolioContext.Provider value={STUB}>{children}</PortfolioContext.Provider>
}

export function usePortfolio(): PortfolioApi {
  const v = useContext(PortfolioContext)
  if (!v) throw new Error('usePortfolio must be used within a PortfolioProvider')
  return v
}
