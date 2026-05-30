import type { Auction, Bid } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `auctions`, `bids`, id counters; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listAuctions(_filter?: { open?: string | null }): Auction[] {
  // TODO: return auctions, applying optional ?open filter
  return []
}

export function findAuction(_id: string): Auction | undefined {
  // TODO: look up an auction by id
  return undefined
}

export function createAuction(_input: { title: string; hoursLeft?: number; startBid?: number }): Auction {
  // TODO: append a new auction with a fresh id and return it
  return { id: '', title: '', currentBid: 0, highBidder: null, hoursLeft: 0, closed: false }
}

export function listBids(_filter?: { auctionId?: string | null }): Bid[] {
  // TODO: return bids, applying optional auctionId filter
  return []
}

export type BidResult =
  | { ok: true; bid: Bid }
  | { ok: false; reason: 'not found' | 'auction closed' | 'bid too low' }

export function placeBid(_input: { auctionId: string; bidder: string; amount: number }): BidResult {
  // TODO: validate the auction exists, is open, and amount beats currentBid; on success
  // append a bid and update the auction; otherwise return the matching failure reason.
  return { ok: false, reason: 'not found' }
}
