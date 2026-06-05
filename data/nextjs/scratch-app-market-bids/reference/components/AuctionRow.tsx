'use client'
import type { Auction } from '../lib/types'

export default function AuctionRow({
  auction,
  onView,
}: {
  auction: Auction
  onView: (id: string) => void
}) {
  return (
    <li data-testid={`auction-${auction.id}`} data-closed={auction.closed ? 'true' : 'false'}>
      <span data-testid={`auction-${auction.id}-title`}>{auction.title}</span>
      <span data-testid={`auction-${auction.id}-bid`}>{auction.currentBid}</span>
      <span data-testid={`auction-${auction.id}-time`}>{auction.hoursLeft}h</span>
      <button data-testid={`view-${auction.id}`} onClick={() => onView(auction.id)}>
        View
      </button>
    </li>
  )
}
