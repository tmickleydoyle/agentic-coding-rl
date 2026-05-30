'use client'
import type { Auction } from '../lib/types'

export default function AuctionRow(_props: {
  auction: Auction
  onView: (id: string) => void
}) {
  // TODO: render an auction row with title, current bid, time left, and a view-<id> button.
  return <li data-testid={`auction-${_props.auction.id}`} />
}
