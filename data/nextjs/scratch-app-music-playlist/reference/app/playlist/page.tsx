'use client'
import { useApp } from '../../components/AppStateProvider'
import { useLibrary } from '../../hooks/useLibrary'

export default function PlaylistPage() {
  const { songs, addSongToPlaylist, removeSongFromPlaylist } = useApp()
  const { selectedPlaylist, playlistSongs } = useLibrary()

  if (!selectedPlaylist) {
    return (
      <section data-testid="page-playlist">
        <h1>Playlist</h1>
        <p data-testid="no-playlist">Open a playlist first.</p>
      </section>
    )
  }

  const playlist = selectedPlaylist
  const addable = songs.filter((s) => !playlist.songIds.includes(s.id))

  return (
    <section data-testid="page-playlist">
      <h1>Playlist</h1>
      <p data-testid="playlist-title">{playlist.name}</p>
      <select
        data-testid="add-song-select"
        value="placeholder"
        onChange={(e) => {
          if (e.target.value !== 'placeholder') addSongToPlaylist(playlist.id, e.target.value)
        }}
      >
        <option value="placeholder">Add a song…</option>
        {addable.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title}
          </option>
        ))}
      </select>
      {playlistSongs.length === 0 ? (
        <p data-testid="playlist-empty">No songs in this playlist.</p>
      ) : (
        <ul data-testid="playlist-songs">
          {playlistSongs.map((s) => (
            <li key={s.id} data-testid={`pl-song-${s.id}`}>
              <span data-testid={`pl-song-${s.id}-title`}>{s.title}</span>
              <button
                data-testid={`remove-${s.id}`}
                onClick={() => removeSongFromPlaylist(playlist.id, s.id)}
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
