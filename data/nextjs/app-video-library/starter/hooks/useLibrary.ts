'use client'
import { useApp } from '../components/AppStateProvider'
import type { Video } from '../lib/types'

export function findVideo(_videos: Video[], _id: string | null): Video | undefined {
  // TODO: look up a video by id
  return undefined
}

export function videosByCategory(_videos: Video[]): { category: string; videos: Video[] }[] {
  // TODO: group videos by category in first-seen order
  return []
}

export function useHistory(): Video[] {
  // TODO: return watched videos in watchedIds order
  void useApp
  return []
}

export function useWatchlist(): Video[] {
  // TODO: return watchlist videos
  return []
}
