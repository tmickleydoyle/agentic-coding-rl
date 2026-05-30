'use client'
import { useApp } from '../../components/AppStateProvider'
import { useAlbums } from '../../hooks/useAlbums'

export default function AlbumDetailPage() {
  const { rateAlbum, toggleFavorite } = useApp()
  const { selectedAlbum } = useAlbums()

  if (!selectedAlbum) {
    return (
      <section data-testid="page-album-detail">
        <h1>Detail</h1>
        <p data-testid="no-album">Open an album first.</p>
      </section>
    )
  }

  const album = selectedAlbum
  const totalLength = album.tracks.reduce((sum, t) => sum + t.lengthSec, 0)

  return (
    <section data-testid="page-album-detail">
      <h1>Detail</h1>
      <p data-testid="detail-title">{album.title}</p>
      <p data-testid="detail-artist">{album.artist}</p>
      <p data-testid="detail-year">{album.year}</p>
      <p data-testid="detail-rating">{album.rating}</p>
      <p data-testid="detail-total-length">{totalLength}</p>
      <div>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} data-testid={`rate-${n}`} onClick={() => rateAlbum(album.id, n)}>
            {n}
          </button>
        ))}
      </div>
      <button data-testid="toggle-fav" onClick={() => toggleFavorite(album.id)}>
        {album.favorite ? 'Unfavorite' : 'Favorite'}
      </button>
      <ul data-testid="track-list">
        {album.tracks.map((t) => (
          <li key={t.id} data-testid={`track-${t.id}`}>
            <span data-testid={`track-${t.id}-title`}>{t.title}</span>
            <span data-testid={`track-${t.id}-length`}>{t.lengthSec}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
