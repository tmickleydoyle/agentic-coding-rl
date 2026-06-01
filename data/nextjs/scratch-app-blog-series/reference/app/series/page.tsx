'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSeries } from '../../hooks/useSeries'
import SeriesCard from '../../components/SeriesCard'

export default function SeriesPage() {
  const { series, selectSeries, navigate } = useApp()
  const { partsFor, progressFor } = useSeries()

  const open = (id: string) => {
    selectSeries(id)
    navigate('series-detail')
  }

  return (
    <section data-testid="page-series">
      <h1>Series</h1>
      <ul data-testid="series-list">
        {series.map((s) => (
          <SeriesCard
            key={s.id}
            series={s}
            partCount={partsFor(s.id).length}
            percent={progressFor(s.id).percent}
            onOpen={open}
          />
        ))}
      </ul>
    </section>
  )
}
