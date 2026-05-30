'use client'
import { useApp } from '../components/AppStateProvider'
import type { Episode, Show } from '../lib/types'

export function collectCategories(_shows: Show[]): string[] {
  // TODO: return sorted unique categories across the shows
  return []
}

export function allEpisodes(_shows: Show[]): Episode[] {
  // TODO: flatten all episodes across shows
  return []
}

export function episodesByIds(_shows: Show[], _ids: string[]): Episode[] {
  // TODO: map episode ids to episodes in order, skipping missing
  return []
}

export function useShows() {
  const { shows } = useApp()
  void shows
  // TODO: return visibleShows, categories, subscriptions, selectedShow, queueEpisodes,
  // totalQueueMinutes, unplayedCount.
  return {
    visibleShows: [] as Show[],
    categories: [] as string[],
    subscriptions: [] as Show[],
    selectedShow: null as Show | null,
    queueEpisodes: [] as Episode[],
    totalQueueMinutes: 0,
    unplayedCount: 0,
  }
}
