'use client'
import { useApp } from '../../components/AppStateProvider'
import { useLyrics } from '../../hooks/useLyrics'

export default function SongsPage() {
  const { artistFilter, setArtistFilter, openSong } = useApp()
  const { visibleSongs, artists } = useLyrics()

  return (
    <section data-testid="page-songs">
      <h1>Songs</h1>
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
      {visibleSongs.length === 0 ? (
        <p data-testid="songs-empty">No songs match.</p>
      ) : (
        <ul data-testid="song-list">
          {visibleSongs.map((s) => (
            <li key={s.id} data-testid={`song-${s.id}`}>
              <span data-testid={`song-${s.id}-title`}>{s.title}</span>
              <span data-testid={`song-${s.id}-artist`}>{s.artist}</span>
              <span data-testid={`song-${s.id}-linecount`}>{s.lines.length}</span>
              <button data-testid={`open-${s.id}`} onClick={() => openSong(s.id)}>
                Open
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
