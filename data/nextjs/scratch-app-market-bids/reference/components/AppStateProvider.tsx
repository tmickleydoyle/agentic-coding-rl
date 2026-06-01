'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Auction, Bid, Route, Theme } from '../lib/types'
import { ME } from '../lib/types'

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

const SEED_AUCTIONS: Auction[] = [
  { id: 'a1', title: 'Vintage camera', currentBid: 50, highBidder: 'dave', hoursLeft: 5, closed: false },
  { id: 'a2', title: 'Signed poster', currentBid: 20, highBidder: 'me', hoursLeft: 2, closed: true },
  { id: 'a3', title: 'Gaming console', currentBid: 120, highBidder: 'erin', hoursLeft: 8, closed: false },
]

const SEED_BIDS: Bid[] = [{ id: 'b1', auctionId: 'a2', bidder: 'me', amount: 20 }]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [auctions, setAuctions] = useState<Auction[]>(SEED_AUCTIONS)
  const [bids, setBids] = useState<Bid[]>(SEED_BIDS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('auctions')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextBidId, setNextBidId] = useState(2)

  const value = useMemo<AppApi>(() => {
    const placeBid = (auctionId: string, amount: number): boolean => {
      const auction = auctions.find((a) => a.id === auctionId)
      if (!auction || auction.closed || amount <= auction.currentBid) return false
      const id = `b${nextBidId}`
      setNextBidId((n) => n + 1)
      setBids((prev) => [...prev, { id, auctionId, bidder: ME, amount }])
      setAuctions((prev) =>
        prev.map((a) => (a.id === auctionId ? { ...a, currentBid: amount, highBidder: ME } : a)),
      )
      return true
    }

    const closeAuction = (id: string) => {
      setAuctions((prev) => prev.map((a) => (a.id === id ? { ...a, closed: true } : a)))
    }

    const select = (id: string) => {
      setSelectedId(id)
      setRoute('detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      auctions,
      bids,
      theme,
      route,
      selectedId,
      placeBid,
      closeAuction,
      select,
      setTheme,
      navigate,
    }
  }, [auctions, bids, theme, route, selectedId, nextBidId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
