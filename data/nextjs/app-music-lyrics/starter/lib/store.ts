import type { Song } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `songs` and an id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listSongs(_filter?: { artist?: string | null; q?: string | null }): Song[] {
  // TODO: return songs, applying optional artist + q (title or line) filters
  return []
}

export function createSong(_input: { title: string; artist: string; lines?: string[] }): Song {
  // TODO: append a new song with a fresh id (lines default []) and return it
  return { id: '', title: '', artist: '', lines: [] }
}

export function findSong(_id: string): Song | undefined {
  // TODO: look up a song by id
  return undefined
}

export function updateSong(
  _id: string,
  _patch: { title?: string; artist?: string; lines?: string[] },
): Song | undefined {
  // TODO: apply the patch; return the song or undefined
  return undefined
}

export function deleteSong(_id: string): boolean {
  // TODO: remove the song; return whether it existed
  return false
}
