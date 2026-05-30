import type { Auction, Bid } from './types'

// In-memory server store for the API routes. SEPARATE from the client state.

let auctions: Auction[] = []
let bids: Bid[] = []
let nextAuctionId = 1
let nextBidId = 1

function seed(): void {
  auctions = [
    { id: 'a1', title: 'Vintage camera', currentBid: 50, highBidder: 'dave', hoursLeft: 5, closed: false },
    { id: 'a2', title: 'Signed poster', currentBid: 20, highBidder: 'me', hoursLeft: 2, closed: true },
    { id: 'a3', title: 'Gaming console', currentBid: 120, highBidder: 'erin', hoursLeft: 8, closed: false },
  ]
  bids = [{ id: 'b1', auctionId: 'a2', bidder: 'me', amount: 20 }]
  nextAuctionId = 4
  nextBidId = 2
}

seed()

export function __reset(): void {
  seed()
}

export function listAuctions(filter?: { open?: string | null }): Auction[] {
  let out = auctions.slice()
  if (filter?.open === 'true') out = out.filter((a) => !a.closed)
  return out
}

export function findAuction(id: string): Auction | undefined {
  return auctions.find((a) => a.id === id)
}

export function createAuction(input: { title: string; hoursLeft?: number; startBid?: number }): Auction {
  const auction: Auction = {
    id: `a${nextAuctionId++}`,
    title: input.title,
    currentBid: input.startBid ?? 0,
    highBidder: null,
    hoursLeft: input.hoursLeft ?? 24,
    closed: false,
  }
  auctions.push(auction)
  return auction
}

export function listBids(filter?: { auctionId?: string | null }): Bid[] {
  let out = bids.slice()
  const auctionId = filter?.auctionId
  if (auctionId) out = out.filter((b) => b.auctionId === auctionId)
  return out
}

export type BidResult =
  | { ok: true; bid: Bid }
  | { ok: false; reason: 'not found' | 'auction closed' | 'bid too low' }

export function placeBid(input: { auctionId: string; bidder: string; amount: number }): BidResult {
  const auction = auctions.find((a) => a.id === input.auctionId)
  if (!auction) return { ok: false, reason: 'not found' }
  if (auction.closed) return { ok: false, reason: 'auction closed' }
  if (input.amount <= auction.currentBid) return { ok: false, reason: 'bid too low' }
  const bid: Bid = {
    id: `b${nextBidId++}`,
    auctionId: input.auctionId,
    bidder: input.bidder,
    amount: input.amount,
  }
  bids.push(bid)
  auction.currentBid = input.amount
  auction.highBidder = input.bidder
  return { ok: true, bid }
}
