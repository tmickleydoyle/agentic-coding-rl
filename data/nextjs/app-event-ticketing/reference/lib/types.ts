export type Tier = {
  id: string
  name: string
  price: number
  capacity: number
  sold: number
}

export type EventItem = {
  id: string
  name: string
  date: string
  venue: string
  tiers: Tier[]
}

export type Order = {
  id: string
  eventId: string
  tierId: string
  qty: number
  buyer: string
  total: number
}

export type Route = 'events' | 'event-detail' | 'checkout' | 'my-tickets'
export type Theme = 'light' | 'dark'
