'use client'
import { actualPercent } from '../hooks/useRebalance'
import type { Holding } from '../lib/types'

export default function HoldingRow({
  holding,
  holdings,
  onSelect,
}: {
  holding: Holding
  holdings: Holding[]
  onSelect: (id: string) => void
}) {
  const actual = actualPercent(holding, holdings)
  const drifted = actual !== holding.targetPercent
  return (
    <li data-testid={`holding-${holding.id}`} data-drifted={drifted ? 'true' : 'false'}>
      <span data-testid={`holding-${holding.id}-symbol`}>{holding.symbol}</span>
      <span data-testid={`holding-${holding.id}-value`}>{holding.value}</span>
      <span data-testid={`holding-${holding.id}-actual`}>{actual}</span>
      <span data-testid={`holding-${holding.id}-target`}>{holding.targetPercent}</span>
      <button data-testid={`select-${holding.id}`} onClick={() => onSelect(holding.id)}>
        Edit
      </button>
    </li>
  )
}
