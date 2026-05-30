import type { Station } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `stations` and an id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listStations(_filter?: {
  genre?: string | null
  favorite?: string | null
  minBitrate?: string | null
}): Station[] {
  // TODO: return stations, applying optional genre + favorite + minBitrate filters
  return []
}

export function createStation(_input: { name: string; genre?: string; bitrate?: number }): Station {
  // TODO: append a new station with a fresh id and return it
  return { id: '', name: '', genre: '', bitrate: 0, favorite: false, playCount: 0 }
}

export function findStation(_id: string): Station | undefined {
  // TODO: look up a station by id
  return undefined
}

export function updateStation(
  _id: string,
  _patch: { name?: string; genre?: string; bitrate?: number; favorite?: boolean; play?: boolean },
): Station | undefined {
  // TODO: apply the patch (play:true increments playCount); return the station or undefined
  return undefined
}

export function deleteStation(_id: string): boolean {
  // TODO: remove the station; return whether it existed
  return false
}
