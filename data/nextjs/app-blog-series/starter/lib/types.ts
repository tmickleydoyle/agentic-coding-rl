export type Part = {
  id: string
  seriesId: string
  order: number
  title: string
  read: boolean
}

export type Series = {
  id: string
  title: string
  author: string
}

export type Route = 'series' | 'series-detail' | 'reader' | 'add-part'
export type Theme = 'light' | 'dark'
