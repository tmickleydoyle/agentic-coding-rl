'use client'
import { gainLoss, isGain, marketValue } from '../hooks/usePortfolio'
import type { Holding } from '../lib/types'

export default function HoldingCard({
  holding,
  onSelect,
}: {
  holding: Holding
  onSelect: (id: string) => void
}) {
  return (
    <li data-testid={`holding-${holding.id}`} data-gain={isGain(holding) ? 'true' : 'false'}>
      <span data-testid={`holding-${holding.id}-symbol`}>{holding.symbol}</span>
      <span data-testid={`holding-${holding.id}-shares`}>{holding.shares}</span>
      <span data-testid={`holding-${holding.id}-price`}>{holding.price}</span>
      <span data-testid={`holding-${holding.id}-value`}>{marketValue(holding)}</span>
      <span data-testid={`holding-${holding.id}-gainloss`}>{gainLoss(holding)}</span>
      <button data-testid={`select-${holding.id}`} onClick={() => onSelect(holding.id)}>
        View
      </button>
    </li>
  )
}
