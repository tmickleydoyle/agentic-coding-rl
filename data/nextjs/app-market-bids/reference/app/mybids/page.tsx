'use client'
import { useApp } from '../../components/AppStateProvider'
import { bidsBy } from '../../hooks/useAuctions'
import { ME } from '../../lib/types'

export default function MyBidsPage() {
  const { auctions, bids } = useApp()
  const mine = bidsBy(bids, ME)

  const titleFor = (auctionId: string): string =>
    auctions.find((a) => a.id === auctionId)?.title ?? 'Unknown'

  return (
    <section data-testid="page-mybids">
      <h1>My bids</h1>
      {mine.length === 0 ? (
        <p data-testid="no-bids">You have not placed any bids.</p>
      ) : (
        <ul data-testid="mybids-list">
          {mine.map((b) => (
            <li key={b.id} data-testid={`mybid-${b.id}`}>
              <span data-testid={`mybid-${b.id}-title`}>{titleFor(b.auctionId)}</span>
              <span data-testid={`mybid-${b.id}-amount`}>{b.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
