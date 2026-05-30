export type Provider = {
  id: string
  name: string
  specialty: string
  slots: string[]
}

export type Appointment = {
  id: string
  providerId: string
  date: string
  patient: string
}

export type Route = 'providers' | 'book' | 'appointments' | 'history'
export type Theme = 'light' | 'dark'

export const TODAY = '2026-06-01'
