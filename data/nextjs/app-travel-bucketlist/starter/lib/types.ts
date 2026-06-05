export type Destination = {
  id: string
  name: string
  country: string
  continent: string
  visited: boolean
  notes: string
}

export type Route = 'list' | 'destination-detail' | 'add' | 'visited'
export type Theme = 'light' | 'dark'
