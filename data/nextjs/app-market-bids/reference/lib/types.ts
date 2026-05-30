export type Auction = {
  id: string
  title: string
  currentBid: number
  highBidder: string | null
  hoursLeft: number
  closed: boolean
}

export type Bid = {
  id: string
  auctionId: string
  bidder: string
  amount: number
}

export type Route = 'auctions' | 'detail' | 'mybids' | 'won'
export type Theme = 'light' | 'dark'

export const ME = 'me'
