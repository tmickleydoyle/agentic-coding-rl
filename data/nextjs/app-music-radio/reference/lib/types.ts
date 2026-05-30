export type Station = {
  id: string
  name: string
  genre: string
  bitrate: number
  favorite: boolean
  playCount: number
}

export type Route = 'stations' | 'station-detail' | 'favorites' | 'history'
export type Theme = 'light' | 'dark'
