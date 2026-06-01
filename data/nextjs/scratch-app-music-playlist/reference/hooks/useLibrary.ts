'use client'
import { useApp } from '../components/AppStateProvider'
import type { Playlist, Song } from '../lib/types'

export function collectGenres(songs: Song[]): string[] {
  const set = new Set<string>()
  songs.forEach((s) => set.add(s.genre))
  return Array.from(set).sort()
}

export function filterSongs(songs: Song[], searchQuery: string): Song[] {
  const q = searchQuery.trim().toLowerCase()
  if (q.length === 0) return songs.slice()
  return songs.filter(
    (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q),
  )
}

export function songsByIds(songs: Song[], ids: string[]): Song[] {
  const out: Song[] = []
  ids.forEach((id) => {
    const found = songs.find((s) => s.id === id)
    if (found) out.push(found)
  })
  return out
}

export function useLibrary() {
  const { songs, playlists, selectedPlaylistId, queue, searchQuery } = useApp()
  const visibleSongs = filterSongs(songs, searchQuery)
  const genres = collectGenres(songs)
  const selectedPlaylist: Playlist | null =
    playlists.find((p) => p.id === selectedPlaylistId) ?? null
  const playlistSongs = selectedPlaylist ? songsByIds(songs, selectedPlaylist.songIds) : []
  const queueSongs = songsByIds(songs, queue)
  const totalQueueDuration = queueSongs.reduce((sum, s) => sum + s.durationSec, 0)
  return {
    visibleSongs,
    genres,
    selectedPlaylist,
    playlistSongs,
    queueSongs,
    totalQueueDuration,
  }
}
