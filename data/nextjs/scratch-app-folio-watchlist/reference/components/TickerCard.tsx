'use client'
import { alertHit } from '../hooks/useWatchlist'
import type { Ticker } from '../lib/types'

export default function TickerCard({
  ticker,
  onSelect,
  onRemove,
}: {
  ticker: Ticker
  onSelect: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`ticker-${ticker.id}`} data-alert={alertHit(ticker) ? 'true' : 'false'}>
      <span data-testid={`ticker-${ticker.id}-symbol`}>{ticker.symbol}</span>
      <span data-testid={`ticker-${ticker.id}-price`}>{ticker.price}</span>
      <span data-testid={`ticker-${ticker.id}-target`}>{ticker.targetPrice}</span>
      <span data-testid={`ticker-${ticker.id}-direction`}>{ticker.direction}</span>
      {alertHit(ticker) ? <span data-testid={`ticker-${ticker.id}-hit`}>HIT</span> : null}
      <button data-testid={`select-${ticker.id}`} onClick={() => onSelect(ticker.id)}>
        View
      </button>
      <button data-testid={`remove-${ticker.id}`} onClick={() => onRemove(ticker.id)}>
        Remove
      </button>
    </li>
  )
}
