'use client'
import { useApp } from '../components/AppStateProvider'
import type { Episode, Show } from '../lib/types'

export function collectCategories(shows: Show[]): string[] {
  const set = new Set<string>()
  shows.forEach((s) => set.add(s.category))
  return Array.from(set).sort()
}

export function allEpisodes(shows: Show[]): Episode[] {
  const out: Episode[] = []
  shows.forEach((s) => s.episodes.forEach((e) => out.push(e)))
  return out
}

export function episodesByIds(shows: Show[], ids: string[]): Episode[] {
  const all = allEpisodes(shows)
  const out: Episode[] = []
  ids.forEach((id) => {
    const found = all.find((e) => e.id === id)
    if (found) out.push(found)
  })
  return out
}

export function useShows() {
  const { shows, categoryFilter, selectedShowId, queue } = useApp()
  const visibleShows = categoryFilter
    ? shows.filter((s) => s.category === categoryFilter)
    : shows.slice()
  const categories = collectCategories(shows)
  const subscriptions = shows.filter((s) => s.subscribed)
  const selectedShow: Show | null = shows.find((s) => s.id === selectedShowId) ?? null
  const queueEpisodes = episodesByIds(shows, queue)
  const totalQueueMinutes = queueEpisodes.reduce((sum, e) => sum + e.durationMin, 0)
  const unplayedCount = allEpisodes(shows).filter((e) => !e.played).length
  return {
    visibleShows,
    categories,
    subscriptions,
    selectedShow,
    queueEpisodes,
    totalQueueMinutes,
    unplayedCount,
  }
}
