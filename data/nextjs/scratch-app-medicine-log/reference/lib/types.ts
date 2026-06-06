export interface Medicine {
  id: string
  name: string
  dosage: string
  frequency: 'daily' | 'twice daily' | 'weekly'
  notes: string
}

export interface LogEntry {
  id: string
  medicineId: string
  medicineName: string
  datetime: string
  notes: string
}

export type Route = 'home' | 'medicines' | 'log' | 'schedule'

export interface AppState {
  route: Route
  setRoute: (r: Route) => void
}
