'use client'
import { useApp } from '../components/AppStateProvider'
import type { Song } from '../lib/types'

export type SearchResult = { song: Song; lineIndex: number; line: string }
export type FavoriteLineDetail = {
  songId: string
  lineIndex: number
  line: string
  songTitle: string
}

export function collectArtists(_songs: Song[]): string[] {
  // TODO: return sorted unique artists across the songs
  return []
}

export function searchLines(_songs: Song[], _query: string): SearchResult[] {
  // TODO: case-insensitive line search; blank query -> []
  return []
}

export function useLyrics() {
  const { songs } = useApp()
  void songs
  // TODO: return visibleSongs, artists, selectedSong, searchResults, favoriteLineDetails.
  return {
    visibleSongs: [] as Song[],
    artists: [] as string[],
    selectedSong: null as Song | null,
    searchResults: [] as SearchResult[],
    favoriteLineDetails: [] as FavoriteLineDetail[],
  }
}
