export type Room = {
  id: string
  name: string
  floor: number
}

export type Booking = {
  id: string
  roomId: string
  start: number
  end: number
  title: string
}

export type Route = 'rooms' | 'book' | 'schedule' | 'my-bookings'
export type Theme = 'light' | 'dark'

export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd
}
