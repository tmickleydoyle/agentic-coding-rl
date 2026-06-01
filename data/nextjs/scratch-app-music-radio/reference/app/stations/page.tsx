'use client'
import { useApp } from '../../components/AppStateProvider'
import { useStations } from '../../hooks/useStations'

export default function StationsPage() {
  const { genreFilter, setGenreFilter, play, toggleFavorite, openStation } = useApp()
  const { visibleStations, genres } = useStations()

  return (
    <section data-testid="page-stations">
      <h1>Stations</h1>
      <select
        data-testid="genre-filter"
        value={genreFilter ?? 'all'}
        onChange={(e) => setGenreFilter(e.target.value === 'all' ? null : e.target.value)}
      >
        <option value="all">All genres</option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      {visibleStations.length === 0 ? (
        <p data-testid="stations-empty">No stations match.</p>
      ) : (
        <ul data-testid="station-list">
          {visibleStations.map((s) => (
            <li key={s.id} data-testid={`station-${s.id}`}>
              <span data-testid={`station-${s.id}-name`}>{s.name}</span>
              <span data-testid={`station-${s.id}-genre`}>{s.genre}</span>
              <button data-testid={`play-${s.id}`} onClick={() => play(s.id)}>
                Play
              </button>
              <button data-testid={`fav-${s.id}`} onClick={() => toggleFavorite(s.id)}>
                {s.favorite ? 'Unfavorite' : 'Favorite'}
              </button>
              <button data-testid={`open-${s.id}`} onClick={() => openStation(s.id)}>
                Open
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
