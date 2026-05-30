'use client'
import { useApp } from '../../components/AppStateProvider'

export default function LibraryPage() {
  const { songs, playlists, enqueue, playSong, openPlaylist } = useApp()

  return (
    <section data-testid="page-library">
      <h1>Library</h1>
      <ul data-testid="song-list">
        {songs.map((s) => (
          <li key={s.id} data-testid={`song-${s.id}`}>
            <span data-testid={`song-${s.id}-title`}>{s.title}</span>
            <span data-testid={`song-${s.id}-artist`}>{s.artist}</span>
            <button data-testid={`enqueue-${s.id}`} onClick={() => enqueue(s.id)}>
              Enqueue
            </button>
            <button data-testid={`play-${s.id}`} onClick={() => playSong(s.id)}>
              Play
            </button>
          </li>
        ))}
      </ul>
      <ul data-testid="playlist-list">
        {playlists.map((p) => (
          <li key={p.id} data-testid={`playlist-${p.id}`}>
            <span data-testid={`playlist-${p.id}-name`}>{p.name}</span>
            <button data-testid={`open-playlist-${p.id}`} onClick={() => openPlaylist(p.id)}>
              Open
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
