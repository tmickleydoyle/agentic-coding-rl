export type Route = 'appointments' | 'stylists' | 'reports' | 'settings'
export type Status = 'booked' | 'completed' | 'cancelled'
export type Appt = {
  id: number
  client: string
  stylist: string
  service: string
  price: number
  status: Status
}
export const STYLISTS = ['Ava', 'Mia', 'Leo']
export const SERVICES: { name: string; price: number }[] = [
  { name: 'Haircut', price: 40 },
  { name: 'Color', price: 90 },
  { name: 'Blowout', price: 35 },
]
export function priceOf(service: string): number {
  const s = SERVICES.find((x) => x.name === service)
  return s ? s.price : 0
}
