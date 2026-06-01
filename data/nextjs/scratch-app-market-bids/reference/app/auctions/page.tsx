'use client'
import { useApp } from '../../components/AppStateProvider'
import AuctionRow from '../../components/AuctionRow'

export default function AuctionsPage() {
  const { auctions, select } = useApp()
  return (
    <section data-testid="page-auctions">
      <h1>Auctions</h1>
      <ul data-testid="auction-list">
        {auctions.map((a) => (
          <AuctionRow key={a.id} auction={a} onView={select} />
        ))}
      </ul>
    </section>
  )
}
