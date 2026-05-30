'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_HOLDINGS: Holding[] = [
  { id: 'h1', symbol: 'KO', name: 'Coca-Cola', shares: 100, dividendPerShare: 2, payMonth: 3 },
  { id: 'h2', symbol: 'JNJ', name: 'Johnson & Johnson', shares: 50, dividendPerShare: 4, payMonth: 6 },
  { id: 'h3', symbol: 'PEP', name: 'PepsiCo', shares: 30, dividendPerShare: 5, payMonth: 3 },
  { id: 'h4', symbol: 'VZ', name: 'Verizon', shares: 100, dividendPerShare: 3, payMonth: 12 },
]

export function DividendsProvider({ children }: { children: ReactNode }) {
  const [holdings, setHoldings] = useState<Holding[]>(SEED_HOLDINGS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('dashboard')
  const [selectedHoldingId, setSelectedHoldingId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(5)

  const value = useMemo<DividendsApi>(() => {
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
          dividendPerShare: input.dividendPerShare,
          payMonth: input.payMonth,
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

  return <DividendsContext.Provider value={value}>{children}</DividendsContext.Provider>
}

export function useDividends(): DividendsApi {
  const v = useContext(DividendsContext)
  if (!v) throw new Error('useDividends must be used within a DividendsProvider')
  return v
}
