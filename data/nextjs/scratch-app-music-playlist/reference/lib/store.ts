import type { Song } from './types'

let songs: Song[] = []
let nextId = 1

function seed(): void {
  songs = [
    { id: 's1', title: 'Sunrise', artist: 'Aria', genre: 'pop', durationSec: 210, playCount: 0 },
    { id: 's2', title: 'Night Drive', artist: 'Aria', genre: 'rock', durationSec: 240, playCount: 3 },
    { id: 's3', title: 'Deep Blue', artist: 'Echo', genre: 'jazz', durationSec: 180, playCount: 1 },
    { id: 's4', title: 'Pulse', artist: 'Echo', genre: 'rock', durationSec: 200, playCount: 0 },
  ]
  nextId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listSongs(filter?: {
  genre?: string | null
  artist?: string | null
  q?: string | null
}): Song[] {
  let out = songs.slice()
  const genre = filter?.genre
  if (genre) out = out.filter((s) => s.genre === genre)
  const artist = filter?.artist
  if (artist) out = out.filter((s) => s.artist === artist)
  const q = filter?.q
  if (q && q.trim().length > 0) {
    const needle = q.toLowerCase()
    out = out.filter(
      (s) => s.title.toLowerCase().includes(needle) || s.artist.toLowerCase().includes(needle),
    )
  }
  return out
}

export function createSong(input: {
  title: string
  artist: string
  genre?: string
  durationSec?: number
}): Song {
  const song: Song = {
    id: `s${nextId++}`,
    title: input.title,
    artist: input.artist,
    genre: input.genre ?? '',
    durationSec: input.durationSec ?? 0,
    playCount: 0,
  }
  songs.push(song)
  return song
}

export function findSong(id: string): Song | undefined {
  return songs.find((s) => s.id === id)
}

export function updateSong(
  id: string,
  patch: { title?: string; artist?: string; genre?: string; durationSec?: number; play?: boolean },
): Song | undefined {
  const song = songs.find((s) => s.id === id)
  if (!song) return undefined
  if (typeof patch.title === 'string') song.title = patch.title
  if (typeof patch.artist === 'string') song.artist = patch.artist
  if (typeof patch.genre === 'string') song.genre = patch.genre
  if (typeof patch.durationSec === 'number') song.durationSec = patch.durationSec
  if (patch.play === true) song.playCount += 1
  return song
}

export function deleteSong(id: string): boolean {
  const idx = songs.findIndex((s) => s.id === id)
  if (idx === -1) return false
  songs.splice(idx, 1)
  return true
}
