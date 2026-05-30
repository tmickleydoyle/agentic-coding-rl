'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: WatchlistApi = {
  tickers: [],
  theme: 'light',
  route: 'watchlist',
  selectedTickerId: null,
  addTicker: () => {},
  removeTicker: () => {},
  selectTicker: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  // TODO: hold tickers/theme/route/selectedTickerId in state (seed 4 tickers), implement the
  // actions, and provide them through WatchlistContext. The STUB below makes the app mount
  // but does nothing — replace it with real state + actions.
  return <WatchlistContext.Provider value={STUB}>{children}</WatchlistContext.Provider>
}

export function useWatchlist(): WatchlistApi {
  const v = useContext(WatchlistContext)
  if (!v) throw new Error('useWatchlist must be used within a WatchlistProvider')
  return v
}
