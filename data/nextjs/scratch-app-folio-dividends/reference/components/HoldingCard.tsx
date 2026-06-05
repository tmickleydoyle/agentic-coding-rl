'use client'
import { annualIncome, monthName } from '../hooks/useDividends'
import type { Holding } from '../lib/types'

export default function HoldingCard({
  holding,
  onSelect,
}: {
  holding: Holding
  onSelect: (id: string) => void
}) {
  return (
    <li data-testid={`holding-${holding.id}`}>
      <span data-testid={`holding-${holding.id}-symbol`}>{holding.symbol}</span>
      <span data-testid={`holding-${holding.id}-shares`}>{holding.shares}</span>
      <span data-testid={`holding-${holding.id}-per-share`}>{holding.dividendPerShare}</span>
      <span data-testid={`holding-${holding.id}-income`}>{annualIncome(holding)}</span>
      <span data-testid={`holding-${holding.id}-month`}>{monthName(holding.payMonth)}</span>
      <button data-testid={`select-${holding.id}`} onClick={() => onSelect(holding.id)}>
        View
      </button>
    </li>
  )
}
