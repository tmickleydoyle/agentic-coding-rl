export type Party = {
  id: string
  title: string
  time: number
  rsvped: boolean
  queue: string[]
}

export type Filter = 'upcoming' | 'past'
export type Route = 'parties' | 'party-detail' | 'create' | 'my-parties'
export type Theme = 'light' | 'dark'

export const NOW = 100
