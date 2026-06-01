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
  return (
    <li data-testid={`page-${page.id}`}>
      <span data-testid={`page-${page.id}-path`}>{page.path}</span>
      <span data-testid={`page-${page.id}-views`}>{views}</span>
      <span data-testid={`page-${page.id}-bounce`}>{page.bounceRate}</span>
      <button data-testid={`select-${page.id}`} onClick={() => onSelect(page.id)}>
        Select
      </button>
    </li>
  )
}
