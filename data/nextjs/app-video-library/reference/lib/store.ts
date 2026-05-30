import type { Video } from './types'
import { seedVideos } from './seed'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let videos: Video[] = []
let watchedIds: string[] = []

function seed(): void {
  videos = seedVideos()
  watchedIds = []
}

seed()

export function __reset(): void {
  seed()
}

export function listVideos(): Video[] {
  return videos.slice()
}

export function findVideo(id: string): Video | undefined {
  return videos.find((v) => v.id === id)
}

export function videosByCategory(category: string): Video[] {
  return videos.filter((v) => v.category === category)
}

export function listWatched(): string[] {
  return watchedIds.slice()
}

export function markWatched(id: string): string[] {
  if (!watchedIds.includes(id)) {
    watchedIds = [id, ...watchedIds]
  }
  return watchedIds.slice()
}

export function clearWatched(id: string): boolean {
  if (!watchedIds.includes(id)) return false
  watchedIds = watchedIds.filter((w) => w !== id)
  return true
}
