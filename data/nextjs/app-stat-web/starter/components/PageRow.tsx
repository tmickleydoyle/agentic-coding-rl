'use client'
import type { PageStat } from '../lib/types'

export default function PageRow({
  page,
  views,
  onSelect,
}: {
  page: PageStat
  views: number
  onSelect: (id: string) => void
}) {
  // TODO: render <li data-testid="page-<id>"> with path, range-adjusted views, bounce, and
  // a select-<id> button that calls onSelect(page.id).
  void views
  void onSelect
  return <li data-testid={`page-${page.id}`} />
}
