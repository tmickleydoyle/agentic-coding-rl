export type Service = {
  id: string
  name: string
  durationMin: number
}

export type Booking = {
  id: string
  serviceId: string
  slot: string
  customer: string
}

export type Route = 'services' | 'book' | 'schedule' | 'my-bookings'
export type Theme = 'light' | 'dark'

export const SLOTS: string[] = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']
