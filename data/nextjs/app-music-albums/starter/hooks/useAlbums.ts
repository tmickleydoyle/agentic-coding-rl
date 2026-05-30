'use client'
import { useApp } from '../components/AppStateProvider'
import type { Album } from '../lib/types'

export function collectArtists(_albums: Album[]): string[] {
  // TODO: return sorted unique artists across the albums
  return []
}

export function countByArtist(_albums: Album[]): Record<string, number> {
  // TODO: map each artist to its album count
  return {}
}

export function meanRating(_albums: Album[]): number {
  // TODO: mean rating across rated albums (rating>0), one decimal; 0 if none
  return 0
}

export function useAlbums() {
  const { albums } = useApp()
  void albums
  // TODO: return visibleAlbums, artists, favorites, selectedAlbum, albumCountByArtist,
  // averageRating.
  return {
    visibleAlbums: [] as Album[],
    artists: [] as string[],
    favorites: [] as Album[],
    selectedAlbum: null as Album | null,
    albumCountByArtist: {} as Record<string, number>,
    averageRating: 0,
  }
}
