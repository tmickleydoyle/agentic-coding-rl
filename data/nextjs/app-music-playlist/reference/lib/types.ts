export type Song = {
  id: string
  title: string
  artist: string
  genre: string
  durationSec: number
  playCount: number
}

export type Playlist = {
  id: string
  name: string
  songIds: string[]
}

export type Route = 'library' | 'playlist' | 'queue' | 'search'
export type Theme = 'light' | 'dark'
