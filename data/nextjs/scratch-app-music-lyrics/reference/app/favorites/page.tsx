'use client'
import { useApp } from '../../components/AppStateProvider'
import { useLyrics } from '../../hooks/useLyrics'

export default function FavoritesPage() {
  const { toggleFavoriteLine } = useApp()
  const { favoriteLineDetails } = useLyrics()

  return (
    <section data-testid="page-favorites">
      <h1>Favorite lines</h1>
      <p data-testid="fav-count">{favoriteLineDetails.length}</p>
      {favoriteLineDetails.length === 0 ? (
        <p data-testid="fav-empty">No favorite lines yet.</p>
      ) : (
        <ul data-testid="fav-list">
          {favoriteLineDetails.map((f) => (
            <li key={`${f.songId}-${f.lineIndex}`} data-testid={`favline-${f.songId}-${f.lineIndex}`}>
              <span data-testid={`favline-${f.songId}-${f.lineIndex}-text`}>{f.line}</span>
              <span data-testid={`favline-${f.songId}-${f.lineIndex}-song`}>{f.songTitle}</span>
              <button
                data-testid={`remove-${f.songId}-${f.lineIndex}`}
                onClick={() => toggleFavoriteLine(f.songId, f.lineIndex)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
