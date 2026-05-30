'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_HOLDINGS: Holding[] = [
  { id: 'h1', symbol: 'AAPL', name: 'Apple Inc.', shares: 10, costBasis: 150, price: 200 },
  { id: 'h2', symbol: 'MSFT', name: 'Microsoft Corp.', shares: 5, costBasis: 300, price: 400 },
  { id: 'h3', symbol: 'TSLA', name: 'Tesla Inc.', shares: 8, costBasis: 250, price: 200 },
]

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [holdings, setHoldings] = useState<Holding[]>(SEED_HOLDINGS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('portfolio')
  const [selectedHoldingId, setSelectedHoldingId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<PortfolioApi>(() => {
    const addHolding = (input: NewHoldingInput) => {
      const id = `h${nextId}`
      setNextId((n) => n + 1)
      setHoldings((prev) => [
        ...prev,
        {
          id,
          symbol: input.symbol,
          name: input.name,
          shares: input.shares,
          costBasis: input.costBasis,
          price: input.price,
        },
      ])
    }

    const removeHolding = (id: string) => {
      setHoldings((prev) => prev.filter((h) => h.id !== id))
      setSelectedHoldingId((cur) => (cur === id ? null : cur))
    }

    const selectHolding = (id: string) => {
      setSelectedHoldingId(id)
      setRoute('holding-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      holdings,
      theme,
      route,
      selectedHoldingId,
      addHolding,
      removeHolding,
      selectHolding,
      setTheme,
      navigate,
    }
  }, [holdings, theme, route, selectedHoldingId, nextId])

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio(): PortfolioApi {
  const v = useContext(PortfolioContext)
  if (!v) throw new Error('usePortfolio must be used within a PortfolioProvider')
  return v
}
