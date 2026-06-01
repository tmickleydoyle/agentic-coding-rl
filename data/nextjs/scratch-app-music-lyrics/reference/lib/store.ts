import type { Song } from './types'

let songs: Song[] = []
let nextId = 1

function seed(): void {
  songs = [
    { id: 'g1', title: 'Open Road', artist: 'Aria', lines: ['We ride at dawn', 'Chasing the sun', 'Open road ahead'] },
    { id: 'g2', title: 'Quiet Sea', artist: 'Aria', lines: ['Waves roll slow', 'Quiet sea at night'] },
    { id: 'g3', title: 'City Lights', artist: 'Echo', lines: ['Neon city lights', 'Dancing in the rain', 'Lost in the sound'] },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listSongs(filter?: { artist?: string | null; q?: string | null }): Song[] {
  let out = songs.slice()
  const artist = filter?.artist
  if (artist) out = out.filter((s) => s.artist === artist)
  const q = filter?.q
  if (q && q.trim().length > 0) {
    const needle = q.toLowerCase()
    out = out.filter(
      (s) =>
        s.title.toLowerCase().includes(needle) ||
        s.lines.some((l) => l.toLowerCase().includes(needle)),
    )
  }
  return out
}

export function createSong(input: { title: string; artist: string; lines?: string[] }): Song {
  const song: Song = {
    id: `g${nextId++}`,
    title: input.title,
    artist: input.artist,
    lines: Array.isArray(input.lines) ? input.lines.slice() : [],
  }
  songs.push(song)
  return song
}

export function findSong(id: string): Song | undefined {
  return songs.find((s) => s.id === id)
}

export function updateSong(
  id: string,
  patch: { title?: string; artist?: string; lines?: string[] },
): Song | undefined {
  const song = songs.find((s) => s.id === id)
  if (!song) return undefined
  if (typeof patch.title === 'string') song.title = patch.title
  if (typeof patch.artist === 'string') song.artist = patch.artist
  if (Array.isArray(patch.lines)) song.lines = patch.lines.slice()
  return song
}

export function deleteSong(id: string): boolean {
  const idx = songs.findIndex((s) => s.id === id)
  if (idx === -1) return false
  songs.splice(idx, 1)
  return true
}
