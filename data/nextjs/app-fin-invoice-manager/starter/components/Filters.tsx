'use client'
import type { StatusFilter } from '../lib/types'

export default function Filters({
  statusFilter,
  onStatusChange,
}: {
  statusFilter: StatusFilter
  onStatusChange: (filter: StatusFilter) => void
}) {
  // TODO: render a status-filter <select> (all + one option per status)
  void statusFilter
  void onStatusChange
  return <div data-testid="filters" />
}
