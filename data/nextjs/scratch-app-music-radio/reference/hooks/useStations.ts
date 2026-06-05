'use client'
import { useApp } from '../components/AppStateProvider'
import type { Station } from '../lib/types'

export function collectGenres(stations: Station[]): string[] {
  const set = new Set<string>()
  stations.forEach((s) => set.add(s.genre))
  return Array.from(set).sort()
}

export function stationsByIds(stations: Station[], ids: string[]): Station[] {
  const out: Station[] = []
  ids.forEach((id) => {
    const found = stations.find((s) => s.id === id)
    if (found) out.push(found)
  })
  return out
}

export function useStations() {
  const { stations, genreFilter, selectedStationId, nowPlayingId, history } = useApp()
  const visibleStations = genreFilter
    ? stations.filter((s) => s.genre === genreFilter)
    : stations.slice()
  const genres = collectGenres(stations)
  const favorites = stations.filter((s) => s.favorite)
  const selectedStation: Station | null =
    stations.find((s) => s.id === selectedStationId) ?? null
  const nowPlaying: Station | null = stations.find((s) => s.id === nowPlayingId) ?? null
  const historyStations = stationsByIds(stations, history)
  const totalPlays = stations.reduce((sum, s) => sum + s.playCount, 0)
  return {
    visibleStations,
    genres,
    favorites,
    selectedStation,
    nowPlaying,
    historyStations,
    totalPlays,
  }
}
