'use client'
import { useApp } from '../../components/AppStateProvider'
import { useStations } from '../../hooks/useStations'

export default function StationDetailPage() {
  const { play, toggleFavorite, stop } = useApp()
  const { selectedStation } = useStations()

  if (!selectedStation) {
    return (
      <section data-testid="page-station-detail">
        <h1>Detail</h1>
        <p data-testid="no-station">Open a station first.</p>
      </section>
    )
  }

  const station = selectedStation

  return (
    <section data-testid="page-station-detail">
      <h1>Detail</h1>
      <p data-testid="detail-name">{station.name}</p>
      <p data-testid="detail-genre">{station.genre}</p>
      <p data-testid="detail-bitrate">{station.bitrate}</p>
      <p data-testid="detail-plays">{station.playCount}</p>
      <button data-testid="play-station" onClick={() => play(station.id)}>
        Play
      </button>
      <button data-testid="toggle-fav" onClick={() => toggleFavorite(station.id)}>
        {station.favorite ? 'Unfavorite' : 'Favorite'}
      </button>
      <button data-testid="stop-station" onClick={() => stop()}>
        Stop
      </button>
    </section>
  )
}
