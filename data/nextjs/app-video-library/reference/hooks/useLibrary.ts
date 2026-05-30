'use client'
import { useApp } from '../components/AppStateProvider'
import type { Video } from '../lib/types'

export function findVideo(videos: Video[], id: string | null): Video | undefined {
  if (!id) return undefined
  return videos.find((v) => v.id === id)
}

export function videosByCategory(videos: Video[]): { category: string; videos: Video[] }[] {
  const order: string[] = []
  const groups: Record<string, Video[]> = {}
  videos.forEach((v) => {
    if (!groups[v.category]) {
      groups[v.category] = []
      order.push(v.category)
    }
    groups[v.category].push(v)
  })
  return order.map((category) => ({ category, videos: groups[category] }))
}

export function useHistory(): Video[] {
  const { videos, watchedIds } = useApp()
  const out: Video[] = []
  watchedIds.forEach((id) => {
    const video = videos.find((v) => v.id === id)
    if (video) out.push(video)
  })
  return out
}

export function useWatchlist(): Video[] {
  const { videos, watchlistIds } = useApp()
  const out: Video[] = []
  watchlistIds.forEach((id) => {
    const video = videos.find((v) => v.id === id)
    if (video) out.push(video)
  })
  return out
}
