import type { Station } from './types'

let stations: Station[] = []
let nextId = 1

function seed(): void {
  stations = [
    { id: 'r1', name: 'Jazz FM', genre: 'jazz', bitrate: 128, favorite: true, playCount: 5 },
    { id: 'r2', name: 'Rock Wave', genre: 'rock', bitrate: 256, favorite: false, playCount: 2 },
    { id: 'r3', name: 'Chill Hub', genre: 'electronic', bitrate: 320, favorite: true, playCount: 0 },
    { id: 'r4', name: 'News 24', genre: 'talk', bitrate: 96, favorite: false, playCount: 8 },
  ]
  nextId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listStations(filter?: {
  genre?: string | null
  favorite?: string | null
  minBitrate?: string | null
}): Station[] {
  let out = stations.slice()
  const genre = filter?.genre
  if (genre) out = out.filter((s) => s.genre === genre)
  const favorite = filter?.favorite
  if (favorite === 'true') out = out.filter((s) => s.favorite)
  const minBitrate = filter?.minBitrate
  if (minBitrate != null && minBitrate !== '') {
    const n = Number(minBitrate)
    if (!Number.isNaN(n)) out = out.filter((s) => s.bitrate >= n)
  }
  return out
}

export function createStation(input: { name: string; genre?: string; bitrate?: number }): Station {
  const station: Station = {
    id: `r${nextId++}`,
    name: input.name,
    genre: input.genre ?? '',
    bitrate: input.bitrate ?? 0,
    favorite: false,
    playCount: 0,
  }
  stations.push(station)
  return station
}

export function findStation(id: string): Station | undefined {
  return stations.find((s) => s.id === id)
}

export function updateStation(
  id: string,
  patch: { name?: string; genre?: string; bitrate?: number; favorite?: boolean; play?: boolean },
): Station | undefined {
  const station = stations.find((s) => s.id === id)
  if (!station) return undefined
  if (typeof patch.name === 'string') station.name = patch.name
  if (typeof patch.genre === 'string') station.genre = patch.genre
  if (typeof patch.bitrate === 'number') station.bitrate = patch.bitrate
  if (typeof patch.favorite === 'boolean') station.favorite = patch.favorite
  if (patch.play === true) station.playCount += 1
  return station
}

export function deleteStation(id: string): boolean {
  const idx = stations.findIndex((s) => s.id === id)
  if (idx === -1) return false
  stations.splice(idx, 1)
  return true
}
