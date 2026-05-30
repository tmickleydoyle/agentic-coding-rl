import type { Clip } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `clips` (seed via seedClips()); provide __reset() to re-seed.
// Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listClips(): Clip[] {
  // TODO: return all clips
  return []
}

export function findClip(_id: string): Clip | undefined {
  // TODO: look up a clip by id
  return undefined
}

export function clipsByCategory(_category: string): Clip[] {
  // TODO: filter clips by category
  return []
}

export function likeClip(_id: string): Clip | undefined {
  // TODO: increment the clip's likes and return it; undefined if missing
  return undefined
}
