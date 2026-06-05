'use client'
import type { Deal } from '../lib/types'

export default function DealCard({
  deal,
  onOpen,
}: {
  deal: Deal
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`deal-${deal.id}`} data-stage={deal.stage}>
      <span data-testid={`deal-${deal.id}-title`}>{deal.title}</span>
      <span data-testid={`deal-${deal.id}-value`}>{deal.value}</span>
      <button data-testid={`open-${deal.id}`} onClick={() => onOpen(deal.id)}>
        Open
      </button>
    </li>
  )
}
