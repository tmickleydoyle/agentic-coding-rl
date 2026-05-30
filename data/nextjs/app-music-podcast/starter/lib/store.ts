import type { Show } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `shows` and an id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listShows(_filter?: {
  category?: string | null
  subscribed?: string | null
}): Show[] {
  // TODO: return shows, applying optional category + subscribed filters
  return []
}

export function createShow(_input: { title: string; category?: string }): Show {
  // TODO: append a new show with a fresh id (subscribed:false, episodes:[]) and return it
  return { id: '', title: '', category: '', subscribed: false, episodes: [] }
}

export function findShow(_id: string): Show | undefined {
  // TODO: look up a show by id
  return undefined
}

export function updateShow(
  _id: string,
  _patch: { title?: string; category?: string; subscribed?: boolean; subscribe?: boolean },
): Show | undefined {
  // TODO: apply the patch (subscribe sets subscribed); return the show or undefined
  return undefined
}

export function deleteShow(_id: string): boolean {
  // TODO: remove the show; return whether it existed
  return false
}
