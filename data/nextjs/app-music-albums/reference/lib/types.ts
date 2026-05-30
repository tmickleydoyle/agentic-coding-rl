export type Track = {
  id: string
  title: string
  lengthSec: number
}

export type Album = {
  id: string
  title: string
  artist: string
  year: number
  favorite: boolean
  rating: number
  tracks: Track[]
}

export type Route = 'albums' | 'album-detail' | 'artists' | 'favorites'
export type Theme = 'light' | 'dark'
