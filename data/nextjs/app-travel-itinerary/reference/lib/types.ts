export type Activity = {
  id: string
  tripId: string
  day: number
  title: string
  cost: number
}

export type Trip = {
  id: string
  name: string
  destination: string
  days: number
}

export type Route = 'trips' | 'trip-detail' | 'add-activity' | 'budget'
export type Theme = 'light' | 'dark'
