'use client'
import { useApp } from '../../components/AppStateProvider'
import { useLyrics } from '../../hooks/useLyrics'

export default function SongDetailPage() {
  const { toggleFavoriteLine, isLineFavorite, openArtist } = useApp()
  const { selectedSong } = useLyrics()

  if (!selectedSong) {
    return (
      <section data-testid="page-song-detail">
        <h1>Detail</h1>
        <p data-testid="no-song">Open a song first.</p>
      </section>
    )
  }

  const song = selectedSong

  return (
    <section data-testid="page-song-detail">
      <h1>Detail</h1>
      <p data-testid="detail-title">{song.title}</p>
      <p data-testid="detail-artist">{song.artist}</p>
      <button data-testid="view-artist" onClick={() => openArtist(song.artist)}>
        View artist
      </button>
      <ul data-testid="line-list">
        {song.lines.map((line, index) => (
          <li key={index} data-testid={`line-${index}`}>
            <span data-testid={`line-${index}-text`}>{line}</span>
            <button
              data-testid={`fav-line-${index}`}
              onClick={() => toggleFavoriteLine(song.id, index)}
            >
              {isLineFavorite(song.id, index) ? 'Unfavorite' : 'Favorite'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
