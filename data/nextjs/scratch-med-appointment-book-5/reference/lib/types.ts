export type AppStatus = 'booked' | 'done' | 'no-show'
export type Route = 'appointments' | 'summary' | 'settings'
export type Appointment = {
  id: number
  customer: string
  service: string
  status: AppStatus
}
