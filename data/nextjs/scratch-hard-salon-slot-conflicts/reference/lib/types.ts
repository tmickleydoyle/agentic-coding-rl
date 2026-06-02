export type Route = 'schedule' | 'conflicts' | 'reports' | 'settings'
export type Appt = {
  id: number
  client: string
  stylist: string
  start: number // minutes from midnight
  duration: number // minutes
}
export const STYLISTS = ['Ava', 'Mia', 'Leo']
// Start times offered, label -> minutes from midnight
export const SLOTS: { label: string; minutes: number }[] = [
  { label: '9:00', minutes: 540 },
  { label: '10:00', minutes: 600 },
  { label: '11:00', minutes: 660 },
  { label: '12:00', minutes: 720 },
  { label: '13:00', minutes: 780 },
]
export const DURATIONS = [30, 60, 90]
export function endOf(a: Appt): number {
  return a.start + a.duration
}
export function overlaps(a: Appt, b: Appt): boolean {
  return a.stylist === b.stylist && a.start < endOf(b) && b.start < endOf(a)
}
export function fmt(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}:${m === 0 ? '00' : String(m).padStart(2, '0')}`
}
