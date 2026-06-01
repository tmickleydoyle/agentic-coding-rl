export type Unit = {
  id: string
  label: string
  rent: number
  occupied: boolean
}

export type AppStatus = 'pending' | 'approved' | 'rejected'

export type Application = {
  id: string
  unitId: string
  applicant: string
  status: AppStatus
}

export type Route = 'units' | 'unit-detail' | 'applications' | 'occupancy'
export type Theme = 'light' | 'dark'

export const APP_STATUSES: AppStatus[] = ['pending', 'approved', 'rejected']
