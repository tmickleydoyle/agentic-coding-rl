export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
}

export interface QueueItem {
  id: string
  trackId: string
}

export type Route = 'home' | 'library' | 'artists' | 'queue'
