'use client'
import { useApp } from '../../components/AppStateProvider'
import { useAlbums } from '../../hooks/useAlbums'

export default function AlbumsPage() {
  const { artistFilter, setArtistFilter, toggleFavorite, openAlbum } = useApp()
  const { visibleAlbums, artists } = useAlbums()

  return (
    <section data-testid="page-albums">
      <h1>Albums</h1>
      <select
        data-testid="artist-filter"
        value={artistFilter ?? 'all'}
        onChange={(e) => setArtistFilter(e.target.value === 'all' ? null : e.target.value)}
      >
        <option value="all">All artists</option>
        {artists.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      {visibleAlbums.length === 0 ? (
        <p data-testid="albums-empty">No albums match.</p>
      ) : (
        <ul data-testid="album-list">
          {visibleAlbums.map((a) => (
            <li key={a.id} data-testid={`album-${a.id}`}>
              <span data-testid={`album-${a.id}-title`}>{a.title}</span>
              <span data-testid={`album-${a.id}-artist`}>{a.artist}</span>
              <span data-testid={`album-${a.id}-rating`}>{a.rating}</span>
              <button data-testid={`fav-${a.id}`} onClick={() => toggleFavorite(a.id)}>
                {a.favorite ? 'Unfavorite' : 'Favorite'}
              </button>
              <button data-testid={`open-${a.id}`} onClick={() => openAlbum(a.id)}>
                Open
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
