'use client'
import { useApp } from '../components/AppStateProvider'
import type { Auction, Bid } from '../lib/types'

export type AuctionCounts = {
  total: number
  open: number
  closed: number
}

export function countAuctions(_auctions: Auction[]): AuctionCounts {
  // TODO: compute total/open/closed
  return { total: 0, open: 0, closed: 0 }
}

export function bidsBy(_bids: Bid[], _bidder: string): Bid[] {
  // TODO: return bids placed by the given bidder
  return []
}

export function wonBy(_auctions: Auction[], _bidder: string): Auction[] {
  // TODO: return closed auctions whose highBidder is the given bidder
  return []
}

export function useAuctions() {
  const { auctions, bids } = useApp()
  const counts = countAuctions(auctions)
  return { counts, auctions, bids }
}
