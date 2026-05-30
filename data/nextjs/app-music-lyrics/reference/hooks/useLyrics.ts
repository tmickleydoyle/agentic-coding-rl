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

export function collectArtists(songs: Song[]): string[] {
  const set = new Set<string>()
  songs.forEach((s) => set.add(s.artist))
  return Array.from(set).sort()
}

export function searchLines(songs: Song[], query: string): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (q.length === 0) return []
  const out: SearchResult[] = []
  songs.forEach((song) => {
    song.lines.forEach((line, lineIndex) => {
      if (line.toLowerCase().includes(q)) out.push({ song, lineIndex, line })
    })
  })
  return out
}

export function useLyrics() {
  const { songs, artistFilter, selectedSongId, searchQuery, favoriteLines } = useApp()
  const visibleSongs = artistFilter
    ? songs.filter((s) => s.artist === artistFilter)
    : songs.slice()
  const artists = collectArtists(songs)
  const selectedSong: Song | null = songs.find((s) => s.id === selectedSongId) ?? null
  const searchResults = searchLines(songs, searchQuery)
  const favoriteLineDetails: FavoriteLineDetail[] = []
  favoriteLines.forEach((f) => {
    const song = songs.find((s) => s.id === f.songId)
    if (!song) return
    const line = song.lines[f.lineIndex]
    if (typeof line !== 'string') return
    favoriteLineDetails.push({
      songId: f.songId,
      lineIndex: f.lineIndex,
      line,
      songTitle: song.title,
    })
  })
  return { visibleSongs, artists, selectedSong, searchResults, favoriteLineDetails }
}
