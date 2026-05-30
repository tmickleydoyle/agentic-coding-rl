'use client'
import { useApp } from '../components/AppStateProvider'
import type { Station } from '../lib/types'

export function collectGenres(_stations: Station[]): string[] {
  // TODO: return sorted unique genres across the stations
  return []
}

export function stationsByIds(_stations: Station[], _ids: string[]): Station[] {
  // TODO: map ids to stations in order, skipping missing
  return []
}

export function useStations() {
  const { stations } = useApp()
  void stations
  // TODO: return visibleStations, genres, favorites, selectedStation, nowPlaying,
  // historyStations, totalPlays.
  return {
    visibleStations: [] as Station[],
    genres: [] as string[],
    favorites: [] as Station[],
    selectedStation: null as Station | null,
    nowPlaying: null as Station | null,
    historyStations: [] as Station[],
    totalPlays: 0,
  }
}
