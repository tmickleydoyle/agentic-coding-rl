'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function DetailPage() {
  const { auctions, selectedId, placeBid, closeAuction } = useApp()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState(false)
  const auction = auctions.find((a) => a.id === selectedId)

  if (!auction) {
    return (
      <section data-testid="page-detail">
        <p data-testid="no-selection">No auction selected.</p>
      </section>
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = placeBid(auction.id, Number(amount))
    if (!ok) {
      setError(true)
      return
    }
    setError(false)
    setAmount('')
  }

  return (
    <section data-testid="page-detail">
      <h1 data-testid="detail-title">{auction.title}</h1>
      <p data-testid="detail-bid">{auction.currentBid}</p>
      <p data-testid="detail-high">{auction.highBidder ?? 'none'}</p>
      {auction.closed ? (
        <p data-testid="closed-note">This auction is closed.</p>
      ) : (
        <form data-testid="bid-form" onSubmit={onSubmit}>
          <label htmlFor="bid">Your bid</label>
          <input
            id="bid"
            type="number"
            data-testid="bid-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button type="submit" data-testid="place-bid">
            Place bid
          </button>
        </form>
      )}
      {error ? <p data-testid="bid-error">Your bid must beat the current bid.</p> : null}
      <button data-testid="close-auction" onClick={() => closeAuction(auction.id)}>
        Close auction
      </button>
    </section>
  )
}
