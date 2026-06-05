'use client'
import { useApp } from '../components/AppStateProvider'
import type { Album } from '../lib/types'

export function collectArtists(albums: Album[]): string[] {
  const set = new Set<string>()
  albums.forEach((a) => set.add(a.artist))
  return Array.from(set).sort()
}

export function countByArtist(albums: Album[]): Record<string, number> {
  const out: Record<string, number> = {}
  albums.forEach((a) => {
    out[a.artist] = (out[a.artist] ?? 0) + 1
  })
  return out
}

export function meanRating(albums: Album[]): number {
  const rated = albums.filter((a) => a.rating > 0)
  if (rated.length === 0) return 0
  const sum = rated.reduce((s, a) => s + a.rating, 0)
  return Math.round((sum / rated.length) * 10) / 10
}

export function useAlbums() {
  const { albums, artistFilter, selectedAlbumId } = useApp()
  const visibleAlbums = artistFilter
    ? albums.filter((a) => a.artist === artistFilter)
    : albums.slice()
  const artists = collectArtists(albums)
  const favorites = albums.filter((a) => a.favorite)
  const selectedAlbum: Album | null = albums.find((a) => a.id === selectedAlbumId) ?? null
  const albumCountByArtist = countByArtist(albums)
  const averageRating = meanRating(albums)
  return { visibleAlbums, artists, favorites, selectedAlbum, albumCountByArtist, averageRating }
}
