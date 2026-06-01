import type { Album } from './types'

let albums: Album[] = []
let nextId = 1

function seed(): void {
  albums = [
    {
      id: 'a1',
      title: 'Dawn',
      artist: 'Aria',
      year: 2019,
      favorite: true,
      rating: 5,
      tracks: [
        { id: 't1', title: 'Wake', lengthSec: 200 },
        { id: 't2', title: 'Glow', lengthSec: 180 },
      ],
    },
    {
      id: 'a2',
      title: 'Dusk',
      artist: 'Aria',
      year: 2021,
      favorite: false,
      rating: 0,
      tracks: [{ id: 't3', title: 'Fade', lengthSec: 220 }],
    },
    {
      id: 'a3',
      title: 'Currents',
      artist: 'Echo',
      year: 2018,
      favorite: false,
      rating: 4,
      tracks: [
        { id: 't4', title: 'Tide', lengthSec: 240 },
        { id: 't5', title: 'Drift', lengthSec: 210 },
      ],
    },
    {
      id: 'a4',
      title: 'Signals',
      artist: 'Echo',
      year: 2022,
      favorite: true,
      rating: 0,
      tracks: [{ id: 't6', title: 'Ping', lengthSec: 160 }],
    },
  ]
  nextId = 5
}

seed()

export function __reset(): void {
  seed()
}

function clampRating(n: number): number {
  if (n < 0) return 0
  if (n > 5) return 5
  return n
}

export function listAlbums(filter?: {
  artist?: string | null
  favorite?: string | null
  minRating?: string | null
}): Album[] {
  let out = albums.slice()
  const artist = filter?.artist
  if (artist) out = out.filter((a) => a.artist === artist)
  const favorite = filter?.favorite
  if (favorite === 'true') out = out.filter((a) => a.favorite)
  const minRating = filter?.minRating
  if (minRating != null && minRating !== '') {
    const n = Number(minRating)
    if (!Number.isNaN(n)) out = out.filter((a) => a.rating >= n)
  }
  return out
}

export function createAlbum(input: { title: string; artist: string; year?: number }): Album {
  const album: Album = {
    id: `a${nextId++}`,
    title: input.title,
    artist: input.artist,
    year: input.year ?? 0,
    favorite: false,
    rating: 0,
    tracks: [],
  }
  albums.push(album)
  return album
}

export function findAlbum(id: string): Album | undefined {
  return albums.find((a) => a.id === id)
}

export function updateAlbum(
  id: string,
  patch: { title?: string; artist?: string; year?: number; favorite?: boolean; rating?: number },
): Album | undefined {
  const album = albums.find((a) => a.id === id)
  if (!album) return undefined
  if (typeof patch.title === 'string') album.title = patch.title
  if (typeof patch.artist === 'string') album.artist = patch.artist
  if (typeof patch.year === 'number') album.year = patch.year
  if (typeof patch.favorite === 'boolean') album.favorite = patch.favorite
  if (typeof patch.rating === 'number') album.rating = clampRating(patch.rating)
  return album
}

export function deleteAlbum(id: string): boolean {
  const idx = albums.findIndex((a) => a.id === id)
  if (idx === -1) return false
  albums.splice(idx, 1)
  return true
}
