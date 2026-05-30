import type { Song } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `songs` and an id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listSongs(_filter?: {
  genre?: string | null
  artist?: string | null
  q?: string | null
}): Song[] {
  // TODO: return songs, applying optional genre + artist + q filters
  return []
}

export function createSong(_input: {
  title: string
  artist: string
  genre?: string
  durationSec?: number
}): Song {
  // TODO: append a new song with a fresh id and return it
  return { id: '', title: '', artist: '', genre: '', durationSec: 0, playCount: 0 }
}

export function findSong(_id: string): Song | undefined {
  // TODO: look up a song by id
  return undefined
}

export function updateSong(
  _id: string,
  _patch: { title?: string; artist?: string; genre?: string; durationSec?: number; play?: boolean },
): Song | undefined {
  // TODO: apply the patch (play:true increments playCount); return the song or undefined
  return undefined
}

export function deleteSong(_id: string): boolean {
  // TODO: remove the song; return whether it existed
  return false
}
