'use client'
import type { Kpi } from '../lib/types'
import { isOnTrack, trendOf } from '../hooks/useKpis'

export default function KpiCard({
  kpi,
  onOpen,
}: {
  kpi: Kpi
  onOpen: (id: string) => void
}) {
  const onTrack = isOnTrack(kpi)
  const trend = trendOf(kpi)
  return (
    <li data-testid={`kpi-${kpi.id}`} data-ontrack={onTrack ? 'true' : 'false'} data-trend={trend}>
      <span data-testid={`kpi-${kpi.id}-name`}>{kpi.name}</span>
      <span data-testid={`kpi-${kpi.id}-current`}>{kpi.current}</span>
      <span data-testid={`kpi-${kpi.id}-target`}>{kpi.target}</span>
      <span data-testid={`kpi-${kpi.id}-status`}>{onTrack ? 'on-track' : 'off-track'}</span>
      <span data-testid={`kpi-${kpi.id}-trend`}>{trend}</span>
      <button data-testid={`open-${kpi.id}`} onClick={() => onOpen(kpi.id)}>
        View
      </button>
    </li>
  )
}
