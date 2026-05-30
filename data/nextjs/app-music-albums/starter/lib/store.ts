import type { Album } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `albums` and an id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listAlbums(_filter?: {
  artist?: string | null
  favorite?: string | null
  minRating?: string | null
}): Album[] {
  // TODO: return albums, applying optional artist + favorite + minRating filters
  return []
}

export function createAlbum(_input: { title: string; artist: string; year?: number }): Album {
  // TODO: append a new album (favorite:false, rating:0, tracks:[]) with a fresh id; return it
  return { id: '', title: '', artist: '', year: 0, favorite: false, rating: 0, tracks: [] }
}

export function findAlbum(_id: string): Album | undefined {
  // TODO: look up an album by id
  return undefined
}

export function updateAlbum(
  _id: string,
  _patch: { title?: string; artist?: string; year?: number; favorite?: boolean; rating?: number },
): Album | undefined {
  // TODO: apply the patch (clamp rating 0-5); return the album or undefined
  return undefined
}

export function deleteAlbum(_id: string): boolean {
  // TODO: remove the album; return whether it existed
  return false
}
