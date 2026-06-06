export interface Patient {
  id: string
  name: string
  dob: string
  gender: string
  phone: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  date: string
  time: string
  reason: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  date: string
  diagnosis: string
  notes: string
}

export type Route = 'home' | 'patients' | 'appointments' | 'records'

export interface AppState {
  route: Route
  setRoute: (r: Route) => void
}
