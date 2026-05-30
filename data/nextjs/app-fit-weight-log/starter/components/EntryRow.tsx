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
  // TODO: render date/weight/trend, data-trend, and a remove-<id> button.
  void onRemove
  return <li data-testid={`entry-${entry.id}`} data-trend={trend} />
}
