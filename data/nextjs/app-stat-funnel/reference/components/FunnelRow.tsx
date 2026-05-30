'use client'
import type { FunnelRow as Row } from '../lib/types'

export default function FunnelRow({
  row,
  onSelect,
}: {
  row: Row
  onSelect: (id: string) => void
}) {
  return (
    <li data-testid={`frow-${row.id}`}>
      <span data-testid={`frow-${row.id}-name`}>{row.name}</span>
      <span data-testid={`frow-${row.id}-count`}>{row.count}</span>
      <span data-testid={`frow-${row.id}-dropoff`}>{row.dropOff}</span>
      <button data-testid={`select-${row.id}`} onClick={() => onSelect(row.id)}>
        Select
      </button>
    </li>
  )
}
