'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Direction, Route, Theme, Ticker } from '../lib/types'

type NewTickerInput = {
  symbol: string
  name: string
  price: number
  targetPrice: number
  direction: Direction
}

type WatchlistApi = {
  tickers: Ticker[]
  theme: Theme
  route: Route
  selectedTickerId: string | null
  addTicker: (input: NewTickerInput) => void
  removeTicker: (id: string) => void
  selectTicker: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const WatchlistContext = createContext<WatchlistApi | null>(null)

const SEED_TICKERS: Ticker[] = [
  { id: 't1', symbol: 'AAPL', name: 'Apple Inc.', price: 200, targetPrice: 180, direction: 'above' },
  { id: 't2', symbol: 'MSFT', name: 'Microsoft Corp.', price: 400, targetPrice: 450, direction: 'above' },
  { id: 't3', symbol: 'GOOG', name: 'Alphabet Inc.', price: 150, targetPrice: 160, direction: 'below' },
  { id: 't4', symbol: 'NVDA', name: 'Nvidia Corp.', price: 120, targetPrice: 100, direction: 'below' },
]

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [tickers, setTickers] = useState<Ticker[]>(SEED_TICKERS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('watchlist')
  const [selectedTickerId, setSelectedTickerId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(5)

  const value = useMemo<WatchlistApi>(() => {
    const addTicker = (input: NewTickerInput) => {
      const id = `t${nextId}`
      setNextId((n) => n + 1)
      setTickers((prev) => [
        ...prev,
        {
          id,
          symbol: input.symbol,
          name: input.name,
          price: input.price,
          targetPrice: input.targetPrice,
          direction: input.direction,
        },
      ])
    }

    const removeTicker = (id: string) => {
      setTickers((prev) => prev.filter((t) => t.id !== id))
      setSelectedTickerId((cur) => (cur === id ? null : cur))
    }

    const selectTicker = (id: string) => {
      setSelectedTickerId(id)
      setRoute('ticker-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      tickers,
      theme,
      route,
      selectedTickerId,
      addTicker,
      removeTicker,
      selectTicker,
      setTheme,
      navigate,
    }
  }, [tickers, theme, route, selectedTickerId, nextId])

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}

export function useWatchlist(): WatchlistApi {
  const v = useContext(WatchlistContext)
  if (!v) throw new Error('useWatchlist must be used within a WatchlistProvider')
  return v
}
