'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSeries } from '../../hooks/useSeries'
import PartRow from '../../components/PartRow'

export default function SeriesDetailPage() {
  const { series, currentSeriesId, toggleRead, markRead, navigate } = useApp()
  const { partsFor, progressFor } = useSeries()

  const current = series.find((s) => s.id === currentSeriesId)
  if (!current) {
    return (
      <section data-testid="page-series-detail">
        <p data-testid="no-series">No series selected.</p>
      </section>
    )
  }

  const openReader = (id: string) => {
    markRead(id)
    navigate('reader')
  }

  return (
    <section data-testid="page-series-detail">
      <h1 data-testid="detail-title">{current.title}</h1>
      <p data-testid="detail-progress">{progressFor(current.id).percent}%</p>
      <ul data-testid="part-list">
        {partsFor(current.id).map((p) => (
          <PartRow key={p.id} part={p} onToggle={toggleRead} onOpenReader={openReader} />
        ))}
      </ul>
    </section>
  )
}
