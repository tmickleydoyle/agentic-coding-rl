'use client'
import type { FunnelRow as Row } from '../lib/types'

export default function FunnelRow({
  row,
  onSelect,
}: {
  row: Row
  onSelect: (id: string) => void
}) {
  // TODO: render <li data-testid="frow-<id>"> with name, count, dropoff, and a select-<id>
  // button that calls onSelect(row.id).
  void onSelect
  return <li data-testid={`frow-${row.id}`} />
}
