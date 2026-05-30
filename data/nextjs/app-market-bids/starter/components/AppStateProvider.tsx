'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Auction, Bid, Route, Theme } from '../lib/types'

type AppApi = {
  auctions: Auction[]
  bids: Bid[]
  theme: Theme
  route: Route
  selectedId: string | null
  placeBid: (auctionId: string, amount: number) => boolean
  closeAuction: (id: string) => void
  select: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  auctions: [],
  bids: [],
  theme: 'light',
  route: 'auctions',
  selectedId: null,
  placeBid: () => false,
  closeAuction: () => {},
  select: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold auctions/bids/theme/route/selectedId in state (seed 3 auctions + 1 bid),
  // implement placeBid (must beat currentBid, auction open), closeAuction, select, navigate.
  // The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
