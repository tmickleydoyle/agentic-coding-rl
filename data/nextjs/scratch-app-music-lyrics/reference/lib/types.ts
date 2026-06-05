export type Song = {
  id: string
  title: string
  artist: string
  lines: string[]
}

export type FavoriteLine = {
  songId: string
  lineIndex: number
}

export type Route = 'songs' | 'song-detail' | 'search' | 'favorites'
export type Theme = 'light' | 'dark'
