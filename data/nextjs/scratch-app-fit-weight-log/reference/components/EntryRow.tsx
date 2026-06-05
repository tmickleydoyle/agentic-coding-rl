'use client'
import type { Trend, WeightEntry } from '../lib/types'

export default function EntryRow({
  entry,
  trend,
  onRemove,
}: {
  entry: WeightEntry
  trend: Trend
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`entry-${entry.id}`} data-trend={trend}>
      <span data-testid={`entry-${entry.id}-date`}>{entry.date}</span>
      <span data-testid={`entry-${entry.id}-weight`}>{entry.weight}</span>
      <span data-testid={`entry-${entry.id}-trend`}>{trend}</span>
      <button data-testid={`remove-${entry.id}`} onClick={() => onRemove(entry.id)}>
        Delete
      </button>
    </li>
  )
}
