'use client'
import type { StatusFilter as StatusFilterType } from '../lib/types'

export default function StatusFilter({
  value,
  onChange,
}: {
  value: StatusFilterType
  onChange: (v: StatusFilterType) => void
}) {
  // TODO: render a status-filter <select> (all + the four statuses) wired to onChange.
  void value
  void onChange
  return <div data-testid="status-filter-wrap" />
}
