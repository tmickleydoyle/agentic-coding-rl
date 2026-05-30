'use client'
import type { TimeFilter } from '../lib/types'

export default function Filters({
  timeFilter,
  onTimeChange,
}: {
  timeFilter: TimeFilter
  onTimeChange: (filter: TimeFilter) => void
}) {
  // TODO: render a time-filter <select> with all/upcoming/past options
  void timeFilter
  void onTimeChange
  return <div data-testid="filters" />
}
