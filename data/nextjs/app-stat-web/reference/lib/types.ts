export type DateRange = '7d' | '30d' | 'all'

export type PageStat = {
  id: string
  path: string
  views: number
  sessions: number
  bounceRate: number
  range7d: number
  range30d: number
}

export type Source = {
  id: string
  name: string
  sessions: number
  conversions: number
}

export type Route = 'overview' | 'pages' | 'sources' | 'settings'
export type Theme = 'light' | 'dark'
