'use client'
import type { Series } from '../lib/types'

export default function SeriesCard({
  series,
  partCount,
  percent,
  onOpen,
}: {
  series: Series
  partCount: number
  percent: number
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`series-${series.id}`}>
      <span data-testid={`series-${series.id}-title`}>{series.title}</span>
      <span data-testid={`series-${series.id}-author`}>{series.author}</span>
      <span data-testid={`part-count-${series.id}`}>{partCount}</span>
      <span data-testid={`progress-${series.id}`}>{percent}%</span>
      <button data-testid={`open-${series.id}`} onClick={() => onOpen(series.id)}>
        Open
      </button>
    </li>
  )
}
