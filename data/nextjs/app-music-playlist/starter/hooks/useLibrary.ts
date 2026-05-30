'use client'
import { useApp } from '../components/AppStateProvider'
import type { Playlist, Song } from '../lib/types'

export function collectGenres(_songs: Song[]): string[] {
  // TODO: return sorted unique genres across the songs
  return []
}

export function filterSongs(_songs: Song[], _searchQuery: string): Song[] {
  // TODO: case-insensitive match on title OR artist; blank query matches all
  return []
}

export function songsByIds(_songs: Song[], _ids: string[]): Song[] {
  // TODO: map ids to songs in order, skipping missing
  return []
}

export function useLibrary() {
  const { songs } = useApp()
  void songs
  // TODO: return visibleSongs, genres, selectedPlaylist, playlistSongs, queueSongs,
  // totalQueueDuration.
  return {
    visibleSongs: [] as Song[],
    genres: [] as string[],
    selectedPlaylist: null as Playlist | null,
    playlistSongs: [] as Song[],
    queueSongs: [] as Song[],
    totalQueueDuration: 0,
  }
}
