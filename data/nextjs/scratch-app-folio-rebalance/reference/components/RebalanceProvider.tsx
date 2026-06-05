'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_HOLDINGS: Holding[] = [
  { id: 'h1', symbol: 'STOCKS', name: 'Stock Fund', value: 6000, targetPercent: 50 },
  { id: 'h2', symbol: 'BONDS', name: 'Bond Fund', value: 3000, targetPercent: 30 },
  { id: 'h3', symbol: 'CASH', name: 'Cash Reserve', value: 1000, targetPercent: 20 },
]

const SEED_HISTORY: RebalanceEntry[] = [
  { id: 'r1', symbol: 'STOCKS', date: '2026-01-15', action: 'SELL', amount: 500 },
  { id: 'r2', symbol: 'CASH', date: '2026-01-15', action: 'BUY', amount: 500 },
]

export function RebalanceProvider({ children }: { children: ReactNode }) {
  const [holdings, setHoldings] = useState<Holding[]>(SEED_HOLDINGS)
  const [history, setHistory] = useState<RebalanceEntry[]>(SEED_HISTORY)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('portfolio')
  const [selectedHoldingId, setSelectedHoldingId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(4)
  const [nextRebalanceId, setNextRebalanceId] = useState(3)

  const value = useMemo<RebalanceApi>(() => {
    const addHolding = (input: NewHoldingInput) => {
      const id = `h${nextId}`
      setNextId((n) => n + 1)
      setHoldings((prev) => [
        ...prev,
        {
          id,
          symbol: input.symbol,
          name: input.name,
          value: input.value,
          targetPercent: input.targetPercent,
        },
      ])
    }

    const removeHolding = (id: string) => {
      setHoldings((prev) => prev.filter((h) => h.id !== id))
      setSelectedHoldingId((cur) => (cur === id ? null : cur))
    }

    const setTarget = (id: string, targetPercent: number) => {
      setHoldings((prev) => prev.map((h) => (h.id === id ? { ...h, targetPercent } : h)))
    }

    const selectHolding = (id: string) => {
      setSelectedHoldingId(id)
      setRoute('targets')
    }

    const logRebalance = (
      entries: { symbol: string; action: 'BUY' | 'SELL'; amount: number }[],
    ) => {
      setHistory((prev) => {
        let counter = nextRebalanceId
        const created: RebalanceEntry[] = entries.map((e) => ({
          id: `r${counter++}`,
          symbol: e.symbol,
          date: '2026-05-29',
          action: e.action,
          amount: e.amount,
        }))
        setNextRebalanceId(counter)
        return [...prev, ...created]
      })
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      holdings,
      history,
      theme,
      route,
      selectedHoldingId,
      addHolding,
      removeHolding,
      setTarget,
      selectHolding,
      logRebalance,
      setTheme,
      navigate,
    }
  }, [holdings, history, theme, route, selectedHoldingId, nextId, nextRebalanceId])

  return <RebalanceContext.Provider value={value}>{children}</RebalanceContext.Provider>
}

export function useRebalance(): RebalanceApi {
  const v = useContext(RebalanceContext)
  if (!v) throw new Error('useRebalance must be used within a RebalanceProvider')
  return v
}
