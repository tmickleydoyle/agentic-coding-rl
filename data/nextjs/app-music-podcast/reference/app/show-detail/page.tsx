'use client'
import { useApp } from '../../components/AppStateProvider'
import { useShows } from '../../hooks/useShows'

export default function ShowDetailPage() {
  const { markPlayed, markUnplayed, enqueue } = useApp()
  const { selectedShow } = useShows()

  if (!selectedShow) {
    return (
      <section data-testid="page-show-detail">
        <h1>Detail</h1>
        <p data-testid="no-show">Open a show first.</p>
      </section>
    )
  }

  const show = selectedShow
  const playedCount = show.episodes.filter((e) => e.played).length

  return (
    <section data-testid="page-show-detail">
      <h1>Detail</h1>
      <p data-testid="detail-title">{show.title}</p>
      <p data-testid="detail-played-count">{playedCount}</p>
      <ul data-testid="episode-list">
        {show.episodes.map((e) => (
          <li key={e.id} data-testid={`ep-${e.id}`}>
            <span data-testid={`ep-${e.id}-title`}>{e.title}</span>
            <span data-testid={`played-${e.id}`}>{e.played ? 'played' : 'unplayed'}</span>
            <button
              data-testid={`toggle-played-${e.id}`}
              onClick={() => (e.played ? markUnplayed(show.id, e.id) : markPlayed(show.id, e.id))}
            >
              Toggle
            </button>
            <button data-testid={`enqueue-${e.id}`} onClick={() => enqueue(e.id)}>
              Enqueue
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
