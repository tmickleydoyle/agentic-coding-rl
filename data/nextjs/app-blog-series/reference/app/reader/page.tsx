'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSeries } from '../../hooks/useSeries'

export default function ReaderPage() {
  const { series, currentSeriesId } = useApp()
  const { partsFor, progressFor } = useSeries()

  const current = series.find((s) => s.id === currentSeriesId)
  if (!current) {
    return (
      <section data-testid="page-reader">
        <p data-testid="no-series">No series selected.</p>
      </section>
    )
  }

  const parts = partsFor(current.id)
  const progress = progressFor(current.id)

  return (
    <section data-testid="page-reader">
      <h1>{current.title}</h1>
      <p data-testid="reader-progress">
        read {progress.read} of {progress.total}
      </p>
      <ul data-testid="reader-list">
        {parts.map((p) => (
          <li
            key={p.id}
            data-testid={`reader-part-${p.id}`}
            data-read={p.read ? 'true' : 'false'}
          >
            {p.title}
          </li>
        ))}
      </ul>
    </section>
  )
}
