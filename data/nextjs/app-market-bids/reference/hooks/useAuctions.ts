'use client'
import { useApp } from '../components/AppStateProvider'
import type { Auction, Bid } from '../lib/types'

export type AuctionCounts = {
  total: number
  open: number
  closed: number
}

export function countAuctions(auctions: Auction[]): AuctionCounts {
  let closed = 0
  auctions.forEach((a) => {
    if (a.closed) closed += 1
  })
  return { total: auctions.length, open: auctions.length - closed, closed }
}

export function bidsBy(bids: Bid[], bidder: string): Bid[] {
  return bids.filter((b) => b.bidder === bidder)
}

export function wonBy(auctions: Auction[], bidder: string): Auction[] {
  return auctions.filter((a) => a.closed && a.highBidder === bidder)
}

export function useAuctions() {
  const { auctions, bids } = useApp()
  const counts = countAuctions(auctions)
  return { counts, auctions, bids }
}
