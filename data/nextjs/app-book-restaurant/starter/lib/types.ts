export type Table = {
  id: string
  name: string
  capacity: number
}

export type Reservation = {
  id: string
  tableId: string
  time: string
  party: number
  name: string
}

export type Route = 'availability' | 'reserve' | 'reservations' | 'tables'
export type Theme = 'light' | 'dark'

export const TIMES: string[] = ['17:00', '18:00', '19:00', '20:00', '21:00']
