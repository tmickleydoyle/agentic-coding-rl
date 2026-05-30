import type { Video } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `videos` (seed via seedVideos()) + `watchedIds`; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listVideos(): Video[] {
  // TODO: return all videos
  return []
}

export function findVideo(_id: string): Video | undefined {
  // TODO: look up a video by id
  return undefined
}

export function videosByCategory(_category: string): Video[] {
  // TODO: filter videos by category
  return []
}

export function listWatched(): string[] {
  // TODO: return watched ids
  return []
}

export function markWatched(_id: string): string[] {
  // TODO: prepend id to watched list (no duplicates); return watched ids
  return []
}

export function clearWatched(_id: string): boolean {
  // TODO: remove id from watched list; return whether it existed
  return false
}
