'use client'
import type { Deal, Stage } from '../lib/types'
import DealCard from './DealCard'

export default function StageColumn({
  stage,
  label,
  deals,
  total,
  onOpen,
}: {
  stage: Stage
  label: string
  deals: Deal[]
  total: number
  onOpen: (id: string) => void
}) {
  return (
    <div data-testid={`column-${stage}`}>
      <h2>{label}</h2>
      <span data-testid={`column-${stage}-count`}>{deals.length}</span>
      <span data-testid={`column-${stage}-value`}>{total}</span>
      <ul data-testid={`column-${stage}-list`}>
        {deals.map((d) => (
          <DealCard key={d.id} deal={d} onOpen={onOpen} />
        ))}
      </ul>
    </div>
  )
}
