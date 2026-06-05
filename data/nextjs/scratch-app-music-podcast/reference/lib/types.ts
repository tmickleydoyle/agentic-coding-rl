export type Episode = {
  id: string
  title: string
  durationMin: number
  played: boolean
}

export type Show = {
  id: string
  title: string
  category: string
  subscribed: boolean
  episodes: Episode[]
}

export type Route = 'shows' | 'show-detail' | 'queue' | 'subscriptions'
export type Theme = 'light' | 'dark'
